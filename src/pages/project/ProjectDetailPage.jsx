import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findProjectDetail } from "../../api/projectApi"; // Updated
import { createIssue as apiCreateIssue } from "../../api/issueApi"; // Updated and aliased
import { updateIssue as apiUpdateIssue } from "../../api/issueApi";
import { deleteIssue as apiDeleteIssue } from "../../api/issueApi";
import { findTeamDetail } from "../../api/teamApi"; // For fetching team members
import { useNavigate } from "react-router-dom";
import AddOrEditIssue from "./AddOrEditIssue";

const ProjectDetailPage = () => {
  const { teamId, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [isAddingIssue, setIsAddingIssue] = useState(false);
  const [isEditingIssue, setIsEditingIssue] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    sp: 3, // Default SP to an integer, e.g., 3 for M
    status: "NOT_STARTED",
    assignees: [],
  });
  const [currentIssueId, setCurrentIssueId] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(newIssue.assignees);
  }, [newIssue.assignees]);

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        const data = await findProjectDetail(teamId, projectId); // Updated
        setProject(data);
        console.log(data);
        if (data && data.issues) {
          setIssues(data.issues);
          console.log(data.issues);
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
      );

      console.log(createdIssue);
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

  const handleUpdateIssue = async () => {
    try {
      // sp is now directly an integer from the state
      const issueToUpdate = {
        issueTitle: newIssue.title,
        issueDescription: newIssue.description,
        issueStoryPoint: newIssue.sp, // Directly use the integer value
        issueStatus: newIssue.status,
        teamMemberIds: newIssue.assignees,
      };

      const updatedIssue = await apiUpdateIssue(
        teamId,
        projectId,
        currentIssueId,
        issueToUpdate
      ); // Updated
      setIssues(
        issues.map((issue) => {
          issue.issueid == currentIssueId ? updatedIssue : issue;
        })
      );
      setIsEditingIssue(false);
      setCurrentIssueId("");
      setNewIssue({
        title: "",
        description: "",
        sp: 3, // Reset to default integer SP
        status: "NOT_STARTED",
        assignees: [],
      });
    } catch (err) {
      console.error("Failed to update issue:", err.response || err);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (window.confirm("이슈를 삭제합니다.")) {
      try {
        await apiDeleteIssue(teamId, projectId, issueId);

        setIssues(issues.map((issue) => issue.issueid !== currentIssueId));
        setCurrentIssueId("");
      } catch (err) {
        console.error("Failed to delete issue:", err.response || err);
      }
    }
  };

  const IssueList = (issues) => {
    return (
      <ul className="divide-y divide-gray-200 border rounded-md">
        {issues.map((issue) =>
          !(issue.issueId == currentIssueId && isEditingIssue) ? (
            <li
              key={issue.issueId}
              className="p-4 hover:bg-gray-100 transition"
            >
              <h3 className="text-lg font-semibold">{issue.issueTitle}</h3>
              <p className="text-sm text-gray-600">{issue.issueDescription}</p>
              <p className="text-sm text-gray-500">
                스토리 포인트: {issue.issueStoryPoint}
              </p>
              <p className="text-sm text-gray-500">
                할당자:{" "}
                {issue.issueAssignees
                  ?.map((assignee) => assignee.assigneeName)
                  .join(", ") || "없음"}
              </p>
              <button
                onClick={() => {
                  console.log(issue);
                  setIsEditingIssue(true);
                  setCurrentIssueId(issue.issueId);
                  setNewIssue({
                    title: issue.issueTitle,
                    description: issue.issueDescription,
                    sp: issue.issueStoryPoint, // Reset to default integer SP
                    status: issue.issueStatus,
                    assignees: issue.issueAssignees.map(
                      (assignee) => assignee.assigneeId
                    ),
                  });
                }}
                className="bg-green-500 mt-2 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                이슈 수정
              </button>
              <button
                onClick={() => {
                  handleDeleteIssue(issue.issueId);
                }}
                className="bg-red-500 mt-2 ml-2 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                이슈 삭제
              </button>
            </li>
          ) : (
            AddOrEditIssue(
              issue.issueId,
              isAddingIssue,
              newIssue,
              teamMembers,
              handleAddIssue,
              handleUpdateIssue,
              setIsAddingIssue,
              setIsEditingIssue,
              setNewIssue
            )
          )
        )}
      </ul>
    );
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
            <h2 className="text-3xl font-bold text-gray-800">이슈 목록</h2>
            {!isAddingIssue && (
              <div>
                {" "}
                <button
                  onClick={() => {
                    setIsAddingIssue(true);
                    setIsEditingIssue(false);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  이슈 추가
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="bg-gray-500 text-white ml-2 px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  뒤로 가기
                </button>
              </div>
            )}
          </div>

          {/* 이슈 추가 폼 */}
          {isAddingIssue &&
            AddOrEditIssue(
              isAddingIssue,
              newIssue,
              teamMembers,
              handleAddIssue,
              handleUpdateIssue,
              setIsAddingIssue,
              setIsEditingIssue,
              setNewIssue
            )}
          {issues.length > 0 ? (
            <>
              <div className="flex">
                <h3 className="text-2xl ml-2 mb-2 font-bold text-gray-800 flex-1">
                  시작 전
                </h3>
                <h3 className="text-2xl ml-2 mb-2 font-bold text-gray-800 flex-1">
                  진행중
                </h3>
                <h3 className="text-2xl ml-2 mb-2 font-bold text-gray-800 flex-1">
                  완료
                </h3>
              </div>
              <div className="flex justify-between">
                <div className="flex-1">
                  {IssueList(
                    issues.filter(
                      (issue) =>
                        issue.issueStatus === "NOT_STARTED" ||
                        console.log(issue)
                    )
                  )}
                </div>
                <div className="flex-1 border-l border-r border-gray">
                  {IssueList(
                    issues.filter(
                      (issue) => issue.issueStatus === "IN_PROGRESS"
                    )
                  )}
                </div>
                <div className="flex-1">
                  {IssueList(
                    issues.filter((issue) => issue.issueStatus === "DONE")
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">등록된 이슈가 없습니다.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
