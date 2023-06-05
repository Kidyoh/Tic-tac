import { PlayerInfo } from "../types/player-info";

function PlayerCard(playerInfo:PlayerInfo) {
    const { name, profilePicture, wins } = playerInfo;
    return (
      <div className="p-4 border border-gray-300 rounded">
        <div className="flex items-center">
          <img src={profilePicture} alt={name} className="w-8 h-8 rounded-full mr-2" />
          <div>
            <p>{name}</p>
            <p>Wins: {wins}</p>
          </div>
        </div>
      </div>
    );
  }

  export {PlayerCard};