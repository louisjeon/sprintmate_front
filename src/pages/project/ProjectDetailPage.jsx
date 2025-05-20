import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findProjectDetail } from "../../api/projectApi"; // Updated
import { createIssue as apiCreateIssue } from "../../api/issueApi"; // Updated and aliased
import { findTeamDetail } from "../../api/teamApi"; // For fetching team members
import { useNavigate } from "react-router-dom";

const ProjectDetailPage = () => {
  const { teamId, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [isAddingIssue, setIsAddingIssue] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    sp: 3, // Default SP to an integer, e.g., 3 for M
    status: "NOT_STARTED",
    assignees: [],
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        const data = await findProjectDetail(teamId, projectId); // Updated
        setProject(data);
        if (data && data.issues) {
          setIssues(data.issues);
        } else {
          setIssues([]);
        }
      } catch (err) {
        console.error("Failed to fetch project details:", err.response || err);
      }
    };

    const loadTeamMembers = async () => {
      try {
        // Team members are part of team details
        const teamData = await findTeamDetail(teamId); // Updated
        if (teamData && teamData.teamMembers) {
          setTeamMembers(teamData.teamMembers);
        } else {
          setTeamMembers([]);
        }
      } catch (err) {
        console.error("Failed to fetch team members:", err.response || err);
      }
    };

    loadProjectDetails();
    loadTeamMembers();
  }, [teamId, projectId]);

  const handleAddIssue = async () => {
    try {
      // sp is now directly an integer from the state
      const issueToCreate = {
        issueTitle: newIssue.title,
        issueDescription: newIssue.description,
        issueStoryPoint: newIssue.sp, // Directly use the integer value
        issueStatus: newIssue.status,
        teamMemberIds: newIssue.assignees,
      };

      const createdIssue = await apiCreateIssue(
        teamId,
        projectId,
        issueToCreate
      ); // Updated
      setIssues([...issues, createdIssue]);
      setIsAddingIssue(false);
      setNewIssue({
        title: "",
        description: "",
        sp: 3, // Reset to default integer SP
        status: "NOT_STARTED",
        assignees: [],
      });
    } catch (err) {
      console.error("Failed to create issue:", err.response || err);
    }
  };

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        프로젝트 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* 프로젝트 정보 */}
        <section className="bg-white shadow rounded-xl p-6">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            {project.projectName}
          </h1>
          {/* projectId is part of the project object from findProjectDetail, 
              but the spec for ProjectDetailResponse doesn't explicitly list projectId.
              Assuming it's available or not strictly needed for display here if not present.
              If it's needed and not in project object, this part might need adjustment
              based on actual API response structure.
              For now, let's assume `projectId` from `useParams` is sufficient if needed elsewhere.
           */}
          <p className="text-gray-600 mb-4">프로젝트 ID: {projectId}</p>
          <p className="text-gray-600">
            생성일: {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </section>

        {/* 이슈 목록 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">이슈 목록</h2>
            {!isAddingIssue && (
              <div>
                {" "}
                <button
                  onClick={() => setIsAddingIssue(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  이슈 추가
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="bg-gray-500 text-white ml-5 px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  뒤로 가기
                </button>
              </div>
            )}
          </div>

          {issues.length > 0 ? (
            <ul className="divide-y divide-gray-200 border rounded-md">
              {issues.map((issue) => (
                <li
                  key={issue.issueId}
                  className="p-4 hover:bg-gray-100 transition"
                >
                  <h3 className="text-lg font-semibold">{issue.issueTitle}</h3>
                  <p className="text-sm text-gray-600">
                    {issue.issueDescription}
                  </p>
                  <p className="text-sm text-gray-500">
                    상태: {issue.issueStatus}
                  </p>
                  <p className="text-sm text-gray-500">
                    스토리 포인트: {issue.issueStoryPoint}
                  </p>
                  <p className="text-sm text-gray-500">
                    할당자:{" "}
                    {issue.issueAssignees
                      ?.map((assignee) => assignee.assigneeName)
                      .join(", ") || "없음"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">등록된 이슈가 없습니다.</p>
          )}
        </section>

        {/* 이슈 추가 폼 */}
        {isAddingIssue && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">새 이슈 추가</h3>
            <input
              type="text"
              placeholder="이슈 제목"
              value={newIssue.title}
              onChange={(e) =>
                setNewIssue({ ...newIssue, title: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <textarea
              placeholder="이슈 설명"
              value={newIssue.description}
              onChange={(e) =>
                setNewIssue({ ...newIssue, description: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="스토리 포인트"
              value={newIssue.sp}
              onChange={(e) =>
                setNewIssue({
                  ...newIssue,
                  sp: parseInt(e.target.value, 10) || 0,
                })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <select
              value={newIssue.status}
              onChange={(e) =>
                setNewIssue({ ...newIssue, status: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            <div className="mb-2">
              <h4 className="text-sm font-semibold mb-1">할당자 선택</h4>
              <div className="flex flex-wrap gap-2">
                {teamMembers.map((member) => (
                  <label
                    key={member.teamMemberId}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      value={member.teamMemberId}
                      checked={newIssue.assignees.includes(member.teamMemberId)}
                      onChange={(e) => {
                        const memberIdAsNumber = parseInt(e.target.value, 10); // Ensure IDs are numbers
                        const isChecked = e.target.checked;
                        setNewIssue((prev) => ({
                          ...prev,
                          assignees: isChecked
                            ? [...prev.assignees, memberIdAsNumber]
                            : prev.assignees.filter(
                                (id) => id !== memberIdAsNumber
                              ),
                        }));
                      }}
                    />
                    {member.memberUsername}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddIssue}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                추가
              </button>
              <button
                onClick={() => setIsAddingIssue(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
