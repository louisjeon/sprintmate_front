import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { findProjectDetail } from "../../api/projectApi"; // Updated
import {
  createIssue as apiCreateIssue,
  estimateStoryPoint,
} from "../../api/issueApi"; // Updated and aliased
import { updateIssue as apiUpdateIssue } from "../../api/issueApi";
import { deleteIssue as apiDeleteIssue } from "../../api/issueApi";
import { estimateStoryPoint as apiEstimateStoryPoint } from "../../api/issueApi";
import { findTeamDetail } from "../../api/teamApi"; // For fetching team members
import { useNavigate } from "react-router-dom";
import AddOrEditIssue from "./AddOrEditIssue";
import { BlinkBlur, Atom, Mosaic, ThreeDot } from "react-loading-indicators";
import IssueCard from "./IssueCard";
import IssueBoardColumn from "./IssueBoardColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const defaultIssues = {
  NOT_STARTED: [],
  IN_PROGRESS: [],
  DONE: [],
};

const ProjectDetailPage = () => {
  const { teamId, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState(defaultIssues);
  const [viewIssue, setViewIssue] = useState(null);
  const [isAddingIssue, setIsAddingIssue] = useState(false);
  const [isEditingIssue, setIsEditingIssue] = useState(false);
  const [isEstimatingStoryPoint, setIsEstimatingStoryPoint] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    sp: 3, // Default SP to an integer, e.g., 3 for M
    status: "NOT_STARTED",
    assignees: [],
  });
  const [currentIssueId, setCurrentIssueId] = useState("");
  const [teamMembers, setTeamMembers] = useState();
  const navigate = useNavigate();
  const [cnt, setCnt] = useState({ i: 0 });

  useEffect(() => {
    if (cnt.i > 0) {
      const timer = setTimeout(() => setCnt({ i: (cnt.i % 3) + 1 }), 400);
      if (!isEstimatingStoryPoint) {
        clearTimeout(timer);
      }
      return () => clearTimeout(timer);
    }
  }, [cnt]);

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        const data = await findProjectDetail(teamId, projectId); // Updated
        setProject(data);
        if (data && data.issues) {
          const newIssues = defaultIssues;
          data.issues.forEach((issue) => {
            let has = false;
            newIssues[issue["issueStatus"]].map((item) => {
              if (item.issueId == issue.issueId) {
                has = true;
              }
            });
            if (!has) {
              newIssues[issue["issueStatus"]].push(issue);
            }
          });
          setIssues(newIssues);
        } else {
          setIssues(defaultIssues);
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

      console.log(issueToCreate);

      const createdIssue = await apiCreateIssue(
        teamId,
        projectId,
        issueToCreate
      );

      // setViewIssue(createdIssue);
      // handleEstimateStoryPoint();
      console.log(createdIssue);
      const newIssues = issues;
      console.log(newIssues);
      newIssues[createdIssue["issueStatus"]].push(createdIssue);
      setIssues(newIssues);
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

  const handleUpdateIssue = async (argIssue, issueId, changeStatus) => {
    try {
      // sp is now directly an integer from the state
      const issue = argIssue || newIssue;
      console.log(argIssue);
      const issueToUpdate = {
        issueTitle: issue.title,
        issueDescription: issue.description,
        issueStoryPoint: issue.sp, // Directly use the integer value
        issueStatus: issue.status,
        teamMemberIds: issue.assignees,
      };

      console.log(issueToUpdate);

      const updatedIssue = await apiUpdateIssue(
        teamId,
        projectId,
        issueId || currentIssueId,
        issueToUpdate
      ); // Updated

      console.log(issue.status);
      console.log(updatedIssue.issueStatus);

      if (changeStatus) {
        const newIssues = issues;
        newIssues["NOT_STARTED"] = newIssues["NOT_STARTED"].filter(
          (issue) => issue.issueId !== issueId
        );
        newIssues["IN_PROGRESS"] = newIssues["IN_PROGRESS"].filter(
          (issue) => issue.issueId !== issueId
        );
        newIssues["DONE"] = newIssues["DONE"].filter(
          (issue) => issue.issueId !== issueId
        );
        newIssues[updatedIssue["issueStatus"]].push(updatedIssue);
        setIssues(newIssues);
      } else {
        const newIssues = {
          NOT_STARTED: issues["NOT_STARTED"].map((issue) =>
            issue.issueId == currentIssueId ? updatedIssue : issue
          ),
          IN_PROGRESS: issues["IN_PROGRESS"].map((issue) =>
            issue.issueId == currentIssueId ? updatedIssue : issue
          ),
          DONE: issues["DONE"].map((issue) =>
            issue.issueId == currentIssueId ? updatedIssue : issue
          ),
        };
        setIssues(newIssues);
      }

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

        const newIssues = {
          NOT_STARTED: issues["NOT_STARTED"].filter(
            (issue) => issue.issueId !== issueId
          ),
          IN_PROGRESS: issues["IN_PROGRESS"].filter(
            (issue) => issue.issueId !== issueId
          ),
          DONE: issues["DONE"].filter((issue) => issue.issueId !== issueId),
        };

        setIssues(newIssues);
        setCurrentIssueId("");
      } catch (err) {
        console.error("Failed to delete issue:", err.response || err);
      }
    }
  };

  const handleEstimateStoryPoint = async () => {
    try {
      setCnt({ i: 1 });
      setIsEstimatingStoryPoint(true);
      const { storyPoint } = await apiEstimateStoryPoint(
        teamId,
        projectId,
        viewIssue.issueId
      );
      setIsEstimatingStoryPoint(false);
      setViewIssue({ ...viewIssue, issueStoryPoint: storyPoint });

      const newIssues = {
        NOT_STARTED: issues["NOT_STARTED"].map((issue) => {
          return issue.issueId === viewIssue.issueId
            ? { ...issue, issueStoryPoint: storyPoint }
            : issue;
        }),
        IN_PROGRESS: issues["IN_PROGRESS"].map((issue) => {
          return issue.issueId === viewIssue.issueId
            ? { ...issue, issueStoryPoint: storyPoint }
            : issue;
        }),
        DONE: issues["DONE"].map((issue) => {
          return issue.issueId === viewIssue.issueId
            ? { ...issue, issueStoryPoint: storyPoint }
            : issue;
        }),
      };

      setIssues(newIssues);
    } catch (err) {
      console.error("Failed to delete issue:", err.response || err);
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
            <h2 className="text-3xl font-bold text-gray-800">이슈 목록</h2>
            {!isAddingIssue && (
              <div>
                {" "}
                <button
                  disabled={isEstimatingStoryPoint}
                  onClick={() => {
                    setIsAddingIssue(true);
                    setIsEditingIssue(false);
                    setViewIssue(null);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  이슈 추가
                </button>
                <button
                  disabled={isEstimatingStoryPoint}
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
              currentIssueId,
              isAddingIssue,
              newIssue,
              teamMembers,
              handleAddIssue,
              handleUpdateIssue,
              setIsAddingIssue,
              setIsEditingIssue,
              setNewIssue,
              false
            )}
          {issues["NOT_STARTED"].length +
            issues["IN_PROGRESS"].length +
            issues["DONE"].length >
          0 ? (
            <div className="relative">
              {viewIssue && (
                <div className="absolute p-5 bg-white border rounded-lg m-auto w-full h-[400px] z-[1]">
                  {isEstimatingStoryPoint && (
                    <div className="absolute flex flex-col items-center justify-evenly top-0 left-0 rounded-lg w-full h-[400px] z-[2] bg-black opacity-80">
                      <div className="flex items-center justify-evenly w-full">
                        <div className="text-center">
                          <Mosaic
                            color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                            size="large"
                          />
                        </div>
                        <div className="text-center">
                          <BlinkBlur
                            color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                            size="small"
                            text=""
                            textColor=""
                          />
                        </div>
                        <div className="text-center">
                          <Atom
                            color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                            size="large"
                            text=""
                            textColor=""
                          />
                        </div>
                      </div>
                      <h1
                        className="text-3xl bg-gradient-to-r bg-clip-text  text-transparent 
            from-[#cd32cd] via-[#327fcd] to-[#327fcd]
            animate-text"
                      >
                        Estimating Story Point{".".repeat(cnt.i)}
                      </h1>
                    </div>
                  )}
                  <h1 className="text-2xl">제목: {viewIssue.issueTitle}</h1>
                  <h1 className="text-2xl">
                    설명: {viewIssue.issueDescription}
                  </h1>
                  <h1 className="text-2xl">
                    스토리포인트: {viewIssue.issueStoryPoint}
                  </h1>
                  <h1 className="text-2xl">상태: {viewIssue.issueStatus}</h1>
                  <h1 className="text-2xl">
                    할당자:{" "}
                    {viewIssue.issueAssignees
                      ?.map((assignee) => assignee.assigneeName)
                      .join(", ") || "없음"}
                  </h1>
                  <div className="absolute right-5 bottom-5">
                    <button
                      disabled={isEstimatingStoryPoint}
                      onClick={handleEstimateStoryPoint}
                      className="bg-green-500 mt-2 ml-2 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      SP 추산
                    </button>
                    <button
                      disabled={isEstimatingStoryPoint}
                      onClick={() => {
                        setViewIssue(null);
                      }}
                      className="bg-red-500 mt-2 ml-2 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              )}
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
              <DndProvider backend={HTML5Backend}>
                <div className="flex justify-between">
                  <div className="flex-1">
                    <IssueBoardColumn
                      issues={issues["NOT_STARTED"]}
                      status="NOT_STARTED"
                      currentIssueId={currentIssueId}
                      newIssue={newIssue}
                      setNewIssue={setNewIssue}
                      isAddingIssue={isAddingIssue}
                      isEditingIssue={isEditingIssue}
                      setViewIssue={setViewIssue}
                      setIsAddingIssue={setIsAddingIssue}
                      setIsEditingIssue={setIsEditingIssue}
                      setCurrentIssueId={setCurrentIssueId}
                      handleUpdateIssue={handleUpdateIssue}
                      handleDeleteIssue={handleDeleteIssue}
                      teamMembers={teamMembers}
                      handleAddIssue={handleAddIssue}
                    />
                  </div>
                  <div className="flex-1 border-l border-r border-gray">
                    <IssueBoardColumn
                      issues={issues["IN_PROGRESS"]}
                      status="IN_PROGRESS"
                      currentIssueId={currentIssueId}
                      newIssue={newIssue}
                      setNewIssue={setNewIssue}
                      isAddingIssue={isAddingIssue}
                      isEditingIssue={isEditingIssue}
                      setViewIssue={setViewIssue}
                      setIsAddingIssue={setIsAddingIssue}
                      setIsEditingIssue={setIsEditingIssue}
                      setCurrentIssueId={setCurrentIssueId}
                      handleUpdateIssue={handleUpdateIssue}
                      handleDeleteIssue={handleDeleteIssue}
                      teamMembers={teamMembers}
                      handleAddIssue={handleAddIssue}
                    />
                  </div>
                  <div className="flex-1">
                    <IssueBoardColumn
                      issues={issues["DONE"]}
                      status="DONE"
                      currentIssueId={currentIssueId}
                      newIssue={newIssue}
                      setNewIssue={setNewIssue}
                      isAddingIssue={isAddingIssue}
                      isEditingIssue={isEditingIssue}
                      setViewIssue={setViewIssue}
                      setIsAddingIssue={setIsAddingIssue}
                      setIsEditingIssue={setIsEditingIssue}
                      setCurrentIssueId={setCurrentIssueId}
                      handleUpdateIssue={handleUpdateIssue}
                      handleDeleteIssue={handleDeleteIssue}
                      teamMembers={teamMembers}
                      handleAddIssue={handleAddIssue}
                    />
                  </div>
                </div>
              </DndProvider>
            </div>
          ) : (
            <p className="text-gray-500">등록된 이슈가 없습니다.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
