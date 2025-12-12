import { findTeamList, findTeamDetail } from "../api/teamApi";
import { findProjectDetail } from "../api/projectApi";

const getTeams = async () => {
	try {
		const response = await findTeamList(); // Fetch teams from API
		if (response && response.teams) {
			return response.teams; // Update state with the teams array
		} else {
			return []; // Fallback to an empty array if no teams are found
		}
	} catch (err) {
		console.error("Failed to fetch teams:", err);
	}
};

const getTeamDetails = async (teamId) => {
	try {
		const data = await findTeamDetail(teamId);
		return data;
	} catch (err) {
		console.error("Failed to fetch team details:", err);
	}
};

const getProjectDetails = async (teamId, projectId) => {
	try {
		const data = await findProjectDetail(teamId, projectId);
		return data;
	} catch (err) {
		console.error("Failed to fetch project details:", err.response || err);
	}
};

const getAllInfo = async () => {
	const obj = {};
	(await getTeams()).map(async (team) => {
		const teamObj = await getTeamDetails(team.teamId);
		const projectList = [];
		teamObj.projects.forEach(async (project) => {
			const projectDetails = await getProjectDetails(
				team.teamId,
				project.projectId
			);
			delete projectDetails.teamMembers;
			projectList.push(projectDetails);
		});
		teamObj.projects = projectList;
		obj[team.teamName] = teamObj;
	});
	return obj;
};

export default getAllInfo;
