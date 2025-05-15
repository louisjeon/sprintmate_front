import React, { useEffect, useState } from "react";
import { findTeamList } from "../../api/teamApi";
import { Link } from "react-router-dom";

const TeamListPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await findTeamList(); // Fetch teams from API
        if (response && response.teams) {
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

  if (loading) {
    return <p className="text-center mt-4">팀 목록을 불러오는 중...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-4">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">팀 목록</h1>
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
    </div>
  );
};

export default TeamListPage;
