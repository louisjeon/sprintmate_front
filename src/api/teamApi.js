import axiosInstance from "./axiosInstance"; // Adjust the path to your axiosInstance configuration

const API_BASE_PATH = "/api/teams";

/**
 * Fetches a list of teams.
 * Corresponds to: GET /api/teams (findTeamList)
 * @returns {Promise<TeamListResponse>}
 */
export const findTeamList = async () => {
  const response = await axiosInstance.get(`${API_BASE_PATH}/me`);
  return response.data;
};

/**
 * Creates a new team.
 * Corresponds to: POST /api/teams (createTeam)
 * @param {object} teamCreateRequest - The team creation data (e.g., { teamName: "New Team" }).
 *                                     This object will be sent as a query parameter named "request".
 * @returns {Promise<TeamCreateResponse>}
 */
export const createTeam = async (teamCreateRequest) => {
  // According to the OpenAPI spec, 'request' is a query parameter containing TeamCreateRequest schema.
  const response = await axiosInstance.post(API_BASE_PATH, teamCreateRequest);
  return response.data;
};

/**
 * Fetches detailed information about a specific team.
 * Corresponds to: GET /api/teams/{teamId} (findTeamDetail)
 * @param {number|string} teamId - The ID of the team.
 * @returns {Promise<TeamDetailResponse>}
 */
export const findTeamDetail = async (teamId) => {
  const response = await axiosInstance.get(`${API_BASE_PATH}/${teamId}`);
  return response.data;
};

/**
 * Updates the name of a specific team.
 * Corresponds to: PATCH /api/teams/{teamId} (updateTeamName)
 * @param {number|string} teamId - The ID of the team.
 * @param {object} teamUpdateNameRequest - The team name update data (e.g., { teamName: "Updated Team Name" }).
 * @returns {Promise<TeamUpdateNameResponse>}
 */
export const updateTeamName = async (teamId, teamUpdateNameRequest) => {
  const response = await axiosInstance.patch(
    `${API_BASE_PATH}/${teamId}`,
    teamUpdateNameRequest
  );
  return response.data;
};

/**
 * Deletes a specific team.
 * Corresponds to: DELETE /api/teams/{teamId} (deleteTeam)
 * @param {number|string} teamId - The ID of the team.
 * @returns {Promise<void>}
 */
export const deleteTeam = async (teamId) => {
  await axiosInstance.delete(`${API_BASE_PATH}/${teamId}`);
};

/**
 * Invites a member to a team.
 * Corresponds to: POST /api/teams/{teamId}/member (inviteTeamMember)
 * @param {number|string} teamId - The ID of the team.
 * @param {object} teamMemberInviteRequest - The invitation data (e.g., { email: "member@example.com", role: "VIEWER" }).
 * @returns {Promise<TeamMemberInviteResponse>}
 */
export const inviteTeamMember = async (teamId, teamMemberInviteRequest) => {
  const response = await axiosInstance.post(
    `${API_BASE_PATH}/${teamId}/members`,
    teamMemberInviteRequest
  );
  return response.data;
};

/**
 * Removes (kicks) a member from a team.
 * Corresponds to: DELETE /api/teams/{teamId}/member/{teamMemberId} (kickTeamMember)
 * @param {number|string} teamId - The ID of the team.
 * @param {number|string} teamMemberId - The ID of the team member to kick.
 * @returns {Promise<void>}
 */
export const kickTeamMember = async (teamId, teamMemberId) => {
  await axiosInstance.delete(
    `${API_BASE_PATH}/${teamId}/member/${teamMemberId}`
  );
};

/**
 * Updates the role of a team member.
 * Corresponds to: PATCH /api/teams/{teamId}/member/{teamMemberId} (updateTeamMemberRole)
 * @param {number|string} teamId - The ID of the team.
 * @param {number|string} teamMemberId - The ID of the team member.
 * @param {object} teamMemberUpdateRoleRequest - The role update data (e.g., { role: "EDITOR" }).
 * @returns {Promise<TeamMemberUpdateRoleResponse>}
 */
export const updateTeamMemberRole = async (
  teamId,
  teamMemberId,
  teamMemberUpdateRoleRequest
) => {
  const response = await axiosInstance.patch(
    `${API_BASE_PATH}/${teamId}/member/${teamMemberId}`,
    teamMemberUpdateRoleRequest
  );
  return response.data;
};
