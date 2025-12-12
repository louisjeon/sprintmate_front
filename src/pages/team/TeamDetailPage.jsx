import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findTeamDetail, deleteTeam as apiDeleteTeam } from "../../api/teamApi"; // Updated
import { createProject as apiCreateProject } from "../../api/projectApi"; // Updated
import { inviteTeamMember as apiInviteTeamMember } from "../../api/teamApi";
import { Users, CalendarClock } from "lucide-react";

const TeamDetailPage = () => {
	const { teamId } = useParams();
	const navigate = useNavigate();
	const [team, setTeam] = useState(null);
	const [error, setError] = useState("");
	const [isAddingProject, setIsAddingProject] = useState(false);
	const [isAddingMember, setIsAddingMember] = useState(false);
	const [newProjectName, setNewProjectName] = useState("");
	const [newMemberDetail, setNewMemberDetail] = useState({
		email: "",
		role: "",
	});

	useEffect(() => {
		const loadTeamDetails = async () => {
			try {
				const data = await findTeamDetail(teamId); // Updated
				console.log(data);
				setTeam(data);
			} catch (err) {
				console.error("Failed to fetch team details:", err);
				setError("팀 상세 정보를 불러오는 데 실패했습니다.");
			}
		};

		loadTeamDetails();
	}, [teamId]);

	const handleCreateProject = async () => {
		try {
			const projectCreateRequest = { projectName: newProjectName }; // Construct request body
			const newProject = await apiCreateProject(
				teamId,
				projectCreateRequest
			); // Updated
			// The response from createProject is ProjectCreateResponse { projectId }
			// To display the full project name, we might need to adjust how it's added or re-fetch.
			// For simplicity, let's assume we want to add the name and the new ID.
			// The actual ProjectTeamResponse structure might differ.
			// Let's add what we have and know.
			setTeam((prev) => ({
				...prev,
				projects: [
					...prev.projects,
					{
						projectId: newProject.projectId,
						projectName: newProjectName,
					}, // Adjust based on actual needs
				],
			}));
			setIsAddingProject(false);
			setNewProjectName("");
		} catch (err) {
			console.error("Failed to create project:", err.response || err);
		}
	};

	const handleInviteMember = async () => {
		try {
			const newMember = await apiInviteTeamMember(
				teamId,
				newMemberDetail
			);

			setTeam((prev) => ({
				...prev,
				teamMembers: [
					...prev.teamMembers,
					{
						teamMemberId: newMember.teamMemberId,
						memberUsername: newMember.memberUsername,
						memberRoleName: newMember.roleName,
					}, // Adjust based on actual needs
				],
			}));
			setIsAddingMember(false);
			setNewMemberDetail({ email: "", role: "" });
		} catch (err) {
			console.error("Failed to add member:", err.response || err);
		}
	};

	const handleDeleteTeam = async () => {
		try {
			await apiDeleteTeam(teamId); // Updated
			navigate("/teams");
		} catch (err) {
			console.error("Failed to delete team:", err.response || err);
		}
	};

	if (error) {
		return <p className="text-center text-red-500 mt-4">{error}</p>;
	}

	if (!team) {
		return (
			<p className="text-center mt-4 text-gray-500">
				팀 정보를 불러오는 중...
			</p>
		);
	}

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">
				{team.teamName}
			</h1>
			<div className="bg-white rounded-xl shadow-md p-6">
				<div className="flex items-center text-sm text-gray-600 gap-4 mb-4">
					<div className="flex items-center gap-1">
						<CalendarClock size={16} />
						<span>
							생성일:{" "}
							{new Date(team.createdAt).toLocaleDateString()}
						</span>
					</div>
				</div>

				{/* 팀원 목록 */}
				<div className="mt-6">
					<h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
						<Users size={20} /> 팀원 목록
					</h3>
					<ul className="divide-y divide-gray-200 border rounded-md">
						{team.teamMembers.map((member) => (
							<li
								key={member.teamMemberId}
								className="flex justify-between items-center px-4 py-2 text-sm"
							>
								<span className="font-medium text-gray-800">
									{member.memberUsername}
								</span>
								<span className="text-gray-500">
									{member.memberRoleName}
								</span>
							</li>
						))}
					</ul>
				</div>

				{/* 프로젝트 목록 */}
				<div className="mt-6">
					<h3 className="text-xl font-semibold mb-3">
						프로젝트 목록
					</h3>
					<ul className="divide-y divide-gray-200 border rounded-md">
						{team.projects.map((project) => (
							<li
								key={project.projectId}
								className="px-4 py-2 text-sm flex items-center justify-between"
							>
								<span>{project.projectName}</span>
								<button
									onClick={() =>
										navigate(
											`/teams/${teamId}/projects/${project.projectId}`
										)
									}
									className="bg-indigo-500 text-white px-2 py-1 rounded text-xs hover:bg-indigo-600" // Adjusted button style
								>
									상세보기
								</button>
							</li>
						))}
					</ul>
				</div>

				{/* 프로젝트 추가 */}
				{isAddingProject && (
					<div className="mt-6 flex gap-2">
						<input
							className="border px-2 py-1 rounded-md flex-grow" // Adjusted input style
							value={newProjectName}
							onChange={(e) => setNewProjectName(e.target.value)}
							placeholder="새 프로젝트 이름"
						/>
						<button
							onClick={handleCreateProject}
							className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" // Adjusted button style
						>
							생성
						</button>
						<button
							onClick={() => setIsAddingProject(false)}
							className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400" // Added cancel button
						>
							취소
						</button>
					</div>
				)}

				{/* 멤버 추가 */}
				{isAddingMember && (
					<div className="mt-6 flex gap-2">
						<input
							className="border px-2 py-1 rounded-md flex-grow" // Adjusted input style
							value={newMemberDetail.email}
							onChange={(e) =>
								setNewMemberDetail({
									...newMemberDetail,
									email: e.target.value,
								})
							}
							placeholder="새 멤버 이메일"
						/>
						<fieldset
							value={newMemberDetail.role}
							onChange={(e) => {
								setNewMemberDetail({
									...newMemberDetail,
									role: e.target.value,
								});
							}}
						>
							<legend>새 멤버 역할:</legend>
							<input
								type="radio"
								id="OWNER"
								name="drone"
								value="OWNER"
							/>
							<label for="OWNER" className="mr-2">
								OWNER
							</label>
							<input
								type="radio"
								id="EDITOR"
								name="drone"
								value="EDITOR"
							/>
							<label for="EDITOR" className="mr-2">
								EDITOR
							</label>
							<input
								type="radio"
								id="VIEWER"
								name="drone"
								value="VIEWER"
							/>
							<label for="louie">VIEWER</label>
						</fieldset>
						<button
							onClick={handleInviteMember}
							className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" // Adjusted button style
						>
							추가
						</button>
						<button
							onClick={() => setIsAddingMember(false)}
							className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400" // Added cancel button
						>
							취소
						</button>
					</div>
				)}
				{!isAddingProject && !isAddingMember && (
					<>
						{" "}
						<button
							onClick={() => setIsAddingProject(true)}
							className="bg-green-500 text-white px-3 py-2 rounded mt-6 hover:bg-green-600" // Adjusted button style
						>
							프로젝트 추가
						</button>
						<button
							onClick={() => setIsAddingMember(true)}
							className="bg-gray-500 ml-2 text-white px-3 py-2 rounded mt-6 hover:bg-gray-600" // Adjusted button style
						>
							팀원 추가
						</button>
					</>
				)}

				<button
					onClick={() => window.history.back()}
					className="mt-6 ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition" // Adjusted button style
				>
					뒤로가기
				</button>
				{/* 팀 삭제 */}
				<button
					onClick={handleDeleteTeam}
					className="bg-red-500 ml-2 text-white px-3 py-2 rounded mt-6 hover:bg-red-600" // Adjusted button style
				>
					팀 삭제
				</button>
			</div>
		</div>
	);
};

export default TeamDetailPage;
