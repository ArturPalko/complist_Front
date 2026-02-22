import lotusImg from "../../Img/lotus.png"

const ConverForLotusSVG = ({ counts }) => (
  <svg width="500" height="45" viewBox="0 0 500 45">
    <path
      d="M7.5,3.75 H367.5 Q371.25,3.75 371.25,11.25 V41.25 Q371.25,45 367.5,45 H7.5 Q3.75,45 3.75,41.25 V11.25 Q3.75,3.75 7.5,3.75 Z"
      fill="rgba(255,235,180,0.9)"
      stroke="rgba(200,180,120,0.9)"
      strokeWidth="1.5"
    />
    <path d="M7.5,22.5 L187.5,41.25 L367.5,22.5" fill="none" stroke="rgba(150,100,50,0.8)" strokeWidth="0.9" />

    {[75, 135, 240, 300].map(x => (
      <line key={x} x1={x} y1="11.25" x2={x} y2="41.25" stroke="rgba(150,100,50,0.6)" strokeWidth="0.75" />
    ))}

    <rect x="135" y="11.25" width="105" height="33.75" rx="3.75" ry="3.75" fill="white" opacity="0.15" stroke="rgba(150,100,50,0.9)" strokeWidth="0.9" />
    <text x="187.5" y="24" textAnchor="middle" fill="black" fontSize="13.5" fontFamily="Arial" fontWeight="bold">
      {counts.countOfMails}
    </text>

    <text x="41.25" y="24" textAnchor="middle" fill="black" fontSize="12.75" fontFamily="Arial" transform="rotate(8 41.25 24)">
      Персональні
    </text>
    <text x="105" y="21" textAnchor="middle" fill="black" fontSize="12.75" fontFamily="Arial" transform="rotate(8 105 21)">
      Підрозділу
    </text>

    <image href={lotusImg} x="150" y="11.25" width="22.5" height="22.5" />
    <text x="202.5" y="37.5" textAnchor="middle" fill="black" fontSize="12.75" fontFamily="Arial" transform="rotate(-6 191.25 37.5)">
      Скриньок
    </text>

    <text x="270" y="19.5" textAnchor="middle" fill="black" fontSize="12.75" fontFamily="Arial" transform="rotate(-8 270 24)">
      <tspan x="270" dy="0">Має</tspan>
      <tspan x="270" dy="10.5">нову назву</tspan>
    </text>

    <text x="352.5" y="15" textAnchor="middle" fill="black" fontSize="12.75" fontFamily="Arial" transform="rotate(-8 333.75 24)">
      <tspan x="330" dy="0">Пароль</tspan>
      <tspan x="345" dy="10.5">відомий</tspan>
    </text>

    <rect x="11.25" y="26.25" width="18.75" height="16.5" rx="2.25" ry="2.25" fill="white" opacity="0.8" />
    <rect x="281.25" y="33" width="16.5" height="10.5" rx="2.25" ry="2.25" fill="white" opacity="0.8" />
    <rect x="348.75" y="26.25" width="18.75" height="16.5" rx="2.25" ry="2.25" fill="white" opacity="0.8" />

    <g>
      <defs>
        <radialGradient id="stoneBlue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7da0b3" />
          <stop offset="100%" stopColor="#4d6b7a" />
        </radialGradient>
        <radialGradient id="stoneGreen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a3c59f" />
          <stop offset="100%" stopColor="#658a5e" />
        </radialGradient>
      </defs>
      <circle cx="90" cy="33.75" r="10.5" fill="url(#stoneBlue)" stroke="black" strokeWidth="1.5" />
      <ellipse cx="112.5" cy="39" rx="9.75" ry="5.25" fill="url(#stoneGreen)" stroke="black" strokeWidth="0.75" transform="rotate(10 112.5 41.25)" />

      <text x="90" y="33.75" textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="9" fontFamily="Arial" fontWeight="bold">
        {counts.departmentMails}
      </text>
      <text x="112.5" y="39.75" textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="7.5" fontFamily="Arial" fontWeight="bold" transform="rotate(10 112.5 41.25)">
        {counts.sectionMails}
      </text>
    </g>

    <text x="21" y="39" textAnchor="middle" fill="black" fontSize="10.5" fontFamily="Arial">
      {counts.personalMails}
    </text>
    <text x="288.75" y="41.25" textAnchor="middle" fill="black" fontSize="9" fontFamily="Arial">
      {counts.hasNewPostName}
    </text>
    <text x="358.5" y="39" textAnchor="middle" fill="black" fontSize="9" fontFamily="Arial">
      {counts.passwordKnown}
    </text>
  </svg>
);

export default ConverForLotusSVG;
