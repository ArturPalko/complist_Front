const ConverForLotusSVG = ({ counts, aca, variant }) => (
   
  <svg width="500" height="60" viewBox="0 0 500 60">
    <path
      d="M10,5 H490 Q495,5 495,15 V55 Q495,60 490,60 H10 Q5,60 5,55 V15 Q5,5 10,5 Z"
      fill="rgba(255,235,180,0.9)"
      stroke="rgba(200,180,120,0.9)"
      strokeWidth="2"
    />
    <path d="M10,30 L250,55 L490,30" fill="none" stroke="rgba(150,100,50,0.8)" strokeWidth="1.2" />

    {[100, 180, 320, 400].map(x => (
      <line key={x} x1={x} y1="15" x2={x} y2="55" stroke="rgba(150,100,50,0.6)" strokeWidth="1" />
    ))}

    <rect x="180" y="15" width="140" height="45" rx="5" ry="5" fill="white" opacity="0.15" stroke="rgba(150,100,50,0.9)" strokeWidth="1.2" />
    <text x="250" y="32" textAnchor="middle" fill="black" fontSize="18" fontFamily="Arial" fontWeight="bold">
      {counts.countOfMails}
    </text>

    <text x="55" y="32" textAnchor="middle" fill="black" fontSize="17" fontFamily="Arial" transform="rotate(8 55 32)">
      Персональні
    </text>
    <text x="140" y="28" textAnchor="middle" fill="black" fontSize="17" fontFamily="Arial" transform="rotate(8 140 28)">
      Підрозділу
    </text>

    <image href={aca} x="200" y="15" width="30" height="30" />
    <text x="270" y="50" textAnchor="middle" fill="black" fontSize="17" fontFamily="Arial" transform="rotate(-6 255 50)">
      Скриньок
    </text>

    <text x="360" y="26" textAnchor="middle" fill="black" fontSize="17" fontFamily="Arial" transform="rotate(-8 360 32)">
      <tspan x="360" dy="0">Має</tspan>
      <tspan x="360" dy="14">нову назву</tspan>
    </text>

    <text x="470" y="20" textAnchor="middle" fill="black" fontSize="17" fontFamily="Arial" transform="rotate(-8 445 32)">
      <tspan x="440" dy="0">Пароль</tspan>
      <tspan x="460" dy="14">відомий</tspan>
    </text>

    <rect x="15" y="35" width="25" height="22" rx="3" ry="3" fill="white" opacity="0.8" />
    <rect x="375" y="44" width="22" height="14" rx="3" ry="3" fill="white" opacity="0.8" />
    <rect x="465" y="35" width="25" height="22" rx="3" ry="3" fill="white" opacity="0.8" />

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
      <circle cx="120" cy="45" r="14" fill="url(#stoneBlue)" stroke="black" strokeWidth="2" />
      <ellipse cx="150" cy="52" rx="13" ry="7" fill="url(#stoneGreen)" stroke="black" strokeWidth="1" transform="rotate(10 150 55)" />

      <text x="120" y="45" textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="12" fontFamily="Arial" fontWeight="bold">
        {counts.departmentMails}
      </text>
      <text x="150" y="53" textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="10" fontFamily="Arial" fontWeight="bold" transform="rotate(10 150 55)">
        {counts.sectionMails}
      </text>
    </g>

    <text x="28" y="52" textAnchor="middle" fill="black" fontSize="14" fontFamily="Arial">
      {counts.personalMails}
    </text>
    <text x="385" y="55" textAnchor="middle" fill="black" fontSize="12" fontFamily="Arial">
      {counts.hasNewPostName}
    </text>
    <text x="478" y="52" textAnchor="middle" fill="black" fontSize="12" fontFamily="Arial">
      {counts.passwordKnown}
    </text>
  </svg>
);

export default ConverForLotusSVG;
