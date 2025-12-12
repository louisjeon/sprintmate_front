import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findProjectDetail } from "../../api/projectApi";
import {
  createIssue as apiCreateIssue,
  updateIssue as apiUpdateIssue,
  deleteIssue as apiDeleteIssue,
  estimateStoryPoint as apiEstimateStoryPoint,
  updateIssueStatus as apiUpdateIssueStatus, // ✅ PATCH용 추가
} from "../../api/issueApi";
import AddOrEditIssue from "./AddOrEditIssue";
import { BlinkBlur, Atom, Mosaic } from "react-loading-indicators";
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
    sp: 3,
    status: "NOT_STARTED",
    assignees: [],
  });
  const [currentIssueId, setCurrentIssueId] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [cnt, setCnt] = useState({ i: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (cnt.i > 0) {
      const timer = setTimeout(() => setCnt({ i: (cnt.i % 3) + 1 }), 400);
      if (!isEstimatingStoryPoint) clearTimeout(timer);
      return () => clearTimeout(timer);
    }
  }, [cnt, isEstimatingStoryPoint]);

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        const data = await findProjectDetail(teamId, projectId);
        setProject(data);
        setTeamMembers(data.teamMembers || []);

        if (data.issues) {
          const newIssues = {
            NOT_STARTED: [],
            IN_PROGRESS: [],
            DONE: [],
          };
          data.issues.forEach((issue) => {
            if (issue && issue.issueStatus && newIssues[issue.issueStatus]) {
              newIssues[issue.issueStatus].push(issue);
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

    loadProjectDetails();
  }, [teamId, projectId]);

  const handleAddIssue = async () => {
    try {
      const issueToCreate = {
        issueTitle: newIssue.title,
        issueDescription: newIssue.description,
        issueStoryPoint: newIssue.sp,
        issueStatus: newIssue.status,
        teamMemberIds: newIssue.assignees,
      };

      setCnt({ i: 1 });
      setIsEstimatingStoryPoint(true);

      const createdIssue = await apiCreateIssue(
        teamId,
        projectId,
        issueToCreate
      );

      console.log(createdIssue);

      setIsEstimatingStoryPoint(false);

      const newIssues = { ...issues };
      newIssues[createdIssue.issueStatus].push(createdIssue);
      setIssues(newIssues);
      setIsAddingIssue(false);
      setNewIssue({
        title: "",
        description: "",
        sp: 3,
        status: "NOT_STARTED",
        assignees: [],
      });
    } catch (err) {
      console.error("Failed to create issue:", err.response || err);
    }
  };

  const handleUpdateIssue = async (argIssue, issueId, changeStatus) => {
    try {
      const issue = argIssue || newIssue;
      const targetIssueId = issueId || currentIssueId;

      let updatedIssue;

      if (changeStatus) {
        // ✅ PATCH: 상태만 변경
        updatedIssue = await apiUpdateIssueStatus(
          teamId,
          projectId,
          targetIssueId,
          {
            issueStatus: issue.status,
          }
        );
      } else {
        // ✅ PUT: 전체 업데이트
        const issueToUpdate = {
          issueTitle: issue.title,
          issueDescription: issue.description,
          issueStoryPoint: issue.sp,
          issueStatus: issue.status,
          teamMemberIds: issue.assignees,
        };

        updatedIssue = await apiUpdateIssue(
          teamId,
          projectId,
          targetIssueId,
          issueToUpdate
        );
      }

      // 공통적으로 이슈 상태 반영
      const updatedIssues = {
        NOT_STARTED: issues.NOT_STARTED.filter(
          (i) => i.issueId !== targetIssueId
        ),
        IN_PROGRESS: issues.IN_PROGRESS.filter(
          (i) => i.issueId !== targetIssueId
        ),
        DONE: issues.DONE.filter((i) => i.issueId !== targetIssueId),
      };
      updatedIssues[updatedIssue.issueStatus].push(updatedIssue);
      setIssues(updatedIssues);

      setIsEditingIssue(false);
      setCurrentIssueId("");
      setNewIssue({
        title: "",
        description: "",
        sp: 3,
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
          NOT_STARTED: issues.NOT_STARTED.filter((i) => i.issueId !== issueId),
          IN_PROGRESS: issues.IN_PROGRESS.filter((i) => i.issueId !== issueId),
          DONE: issues.DONE.filter((i) => i.issueId !== issueId),
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
        NOT_STARTED: issues.NOT_STARTED.map((i) =>
          i.issueId === viewIssue.issueId
            ? { ...i, issueStoryPoint: storyPoint }
            : i
        ),
        IN_PROGRESS: issues.IN_PROGRESS.map((i) =>
          i.issueId === viewIssue.issueId
            ? { ...i, issueStoryPoint: storyPoint }
            : i
        ),
        DONE: issues.DONE.map((i) =>
          i.issueId === viewIssue.issueId
            ? { ...i, issueStoryPoint: storyPoint }
            : i
        ),
      };
      setIssues(newIssues);
    } catch (err) {
      console.error("Failed to estimate story point:", err.response || err);
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
        <section className="bg-white shadow rounded-xl p-6">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            {project.projectName}
          </h1>
          <p className="text-gray-600 mb-4">프로젝트 ID: {projectId}</p>
          <p className="text-gray-600">
            생성일: {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">이슈 목록</h2>
            {!isAddingIssue && (
              <div>
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

          {isAddingIssue &&
            (isEstimatingStoryPoint ? (
              <div className="flex flex-col items-center justify-evenly top-0 left-0 rounded-lg w-full h-[400px] z-[2] bg-black opacity-80">
                <div className="flex items-center justify-evenly w-full">
                  <Mosaic
                    color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                    size="large"
                  />
                  <BlinkBlur
                    color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                    size="small"
                    text=""
                    textColor=""
                  />
                  <Atom
                    color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                    size="large"
                    text=""
                    textColor=""
                  />
                </div>
                <h1
                  className="text-3xl bg-gradient-to-r bg-clip-text  text-transparent 
            from-[#32cd32] via-[#327fcd] to-[#cd8032]
            animate-text"
                >
                  스토리 포인트 측정중{".".repeat(cnt.i)}
                </h1>
              </div>
            ) : (
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
              )
            ))}

          {Object.values(issues).flat().length > 0 ? (
            <div className="relative">
              {viewIssue && (
                <div className="absolute p-5 bg-white border rounded-lg m-auto w-full h-[400px] z-[1]">
                  {isEstimatingStoryPoint && (
                    <div className="absolute flex flex-col items-center justify-evenly top-0 left-0 rounded-lg w-full h-[400px] z-[2] bg-black opacity-80">
                      <div className="flex items-center justify-evenly w-full">
                        <Mosaic
                          color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                          size="large"
                        />
                        <BlinkBlur
                          color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                          size="small"
                          text=""
                          textColor=""
                        />
                        <Atom
                          color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                          size="large"
                          text=""
                          textColor=""
                        />
                      </div>
                      <h1
                        className="text-3xl bg-gradient-to-r bg-clip-text  text-transparent 
            from-[#32cd32] via-[#327fcd] to-[#cd8032]
            animate-text"
                      >
                        스토리 포인트 측정중{".".repeat(cnt.i)}
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
                      ?.map((a) => a.teamMemberName)
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
                      onClick={() => setViewIssue(null)}
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
                  {["NOT_STARTED", "IN_PROGRESS", "DONE"].map((status) => (
                    <div key={status} className="flex-1 border-gray">
                      <IssueBoardColumn
                        issues={issues[status]}
                        status={status}
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
                  ))}
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
