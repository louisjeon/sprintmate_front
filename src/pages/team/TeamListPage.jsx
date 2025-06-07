import React, { useEffect, useState } from "react";
import { findTeamList } from "../../api/teamApi";
import { Link } from "react-router-dom";
import { createTeam as apiCreateTeam } from "../../api/teamApi"; // Updated
import { useAuthStore } from "../../stores/authStore";

const TeamListPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTeamPopup, setNewTeamPopup] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await findTeamList(); // Fetch teams from API
        if (response && response.teams) {
          console.log(response.teams);
          setTeams(response.teams); // Update state with the teams array
        } else {
          setTeams([]); // Fallback to an empty array if no teams are found
        }
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        setError("팀 목록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  const handleCreateTeam = async () => {
    try {
      const teamCreateRequest = { teamName: newTeamName };
      await apiCreateTeam(teamCreateRequest);
      window.location.reload();
    } catch (err) {
      console.error("Failed to create team:", err.response || err);
    }
  };

  if (!isAuthenticated) {
    return <p className="text-center mt-4">로그인이 필요한 서비스입니다.</p>;
  }

  if (loading) {
    return <p className="text-center mt-4">팀 목록을 불러오는 중...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-4">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">나의 팀 목록</h1>
      {teams.length === 0 ? (
        <p className="text-gray-500">등록된 팀이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {teams.map((team) => (
            <li
              key={team.teamId}
              className="bg-white shadow rounded-lg p-4 hover:shadow-md transition"
            >
              <Link to={`/teams/${team.teamId}`} className="block">
                <h2 className="text-lg font-semibold">{team.teamName}</h2>
                <p className="text-sm text-gray-600">역할: {team.role}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {newTeamPopup ? (
        <div className="w-full m-auto mt-5 rounded-lg p-5 bg-white shadow-md">
          <label className="block text-m font-medium text-gray-700 mb-1">
            새 팀 이름
          </label>
          <input
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="팀 이름을 입력하세요"
          ></input>
          <div className="flex justify-end">
            <button
              onClick={() => {
                handleCreateTeam();
                setNewTeamPopup(false);
              }}
              className="mt-5 px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              팀 생성하기
            </button>
            <button
              onClick={() => setNewTeamPopup(false)}
              className="mt-5 ml-5 px-8 py-3 bg-red-500 text-white text-lg font-semibold rounded-lg hover:bg-red-600 transition"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setNewTeamPopup(true)}
          className="mt-5 px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition mb-12"
        >
          팀 생성하기
        </button>
      )}
    </div>
  );
};

export default TeamListPage;
