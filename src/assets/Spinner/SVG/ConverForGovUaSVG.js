const ConverForGovUaSVG = ({ counts }) => (
  <svg width="500" height="60" viewBox="0 0 500 60">
    <defs>
      <linearGradient id="softUkraineFlag" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6ec6ff" />
        <stop offset="50%" stopColor="#6ec6ff" />
        <stop offset="50%" stopColor="#ffe97d" />
        <stop offset="100%" stopColor="#ffe97d" />
      </linearGradient>

      <radialGradient id="brightTurquoise" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#b3f5ec" />
        <stop offset="100%" stopColor="#4fd1b6" />
      </radialGradient>

      <radialGradient id="softLavender" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#e8d9ff" />
        <stop offset="100%" stopColor="#b497e6" />
      </radialGradient>
    </defs>

    <path
      d="M10,5 H490 Q495,5 495,15 V55 Q495,60 490,60 H10 Q5,60 5,55 V15 Q5,5 10,5 Z"
      fill="url(#softUkraineFlag)"
      stroke="rgba(56, 11, 170, 0.9)"
      strokeWidth="2"
    />
    <path d="M10,30 L250,55 L490,30" fill="none" stroke="rgba(56, 11, 170, 0.9)" strokeWidth="1.2" />

    {[100, 180, 320, 400].map(x => (
      <line key={x} x1={x} y1="15" x2={x} y2="55" stroke="rgba(56, 11, 170, 0.9)" strokeWidth="1" />
    ))}

    <rect x="180" y="15" width="140" height="45" rx="5" ry="5" fill="white" opacity="0.15" stroke="rgba(56, 11, 170, 0.9)" strokeWidth="1.2" />
    <text x="210" y="40" textAnchor="middle" fill="black" fontSize="18" fontFamily="Arial" fontWeight="bold">
      {counts.countOfMails}
    </text>

    <text x="55" y="32" textAnchor="middle" fill="black" fontSize="17" fontFamily="Arial" transform="rotate(8 55 32)">
      Персональні
    </text>
    <text x="140" y="28" textAnchor="middle" fill="black" fontSize="17" fontFamily="Arial" transform="rotate(8 140 28)">
      Підрозділу
    </text>

    <text x="220" y="20" textAnchor="middle" fill="white" fontSize="17" fontFamily="Arial">
      <tspan dy="0">gov</tspan>
      <tspan dy="0" fontWeight="bold">.</tspan>
      <tspan dy="0">UA</tspan>
    </text>
    <text x="290" y="20" textAnchor="middle" fill="black" fontSize="17" fontFamily="Arial">
      Скриньок
    </text>

    <text x="300" y="26" textAnchor="middle" fill="black" fontSize="17" fontFamily="Arial" transform="rotate(-8 360 32)">
      <tspan x="360" dy="0">Має</tspan>
      <tspan x="340" dy="14">відпов. особу</tspan>
    </text>

    <text x="470" y="20" textAnchor="middle" fill="black" fontSize="17" fontFamily="Arial" transform="rotate(-8 445 32)">
      <tspan x="440" dy="0">Пароль</tspan>
      <tspan x="460" dy="14">відомий</tspan>
    </text>

    <rect x="15" y="35" width="25" height="22" rx="3" ry="3" fill="white" opacity="0.8" />
    <rect x="375" y="44" width="22" height="14" rx="3" ry="3" fill="white" opacity="0.8" />
    <rect x="465" y="35" width="25" height="22" rx="3" ry="3" fill="white" opacity="0.8" />

    <circle cx="120" cy="45" r="14" fill="url(#brightTurquoise)" stroke="black" strokeWidth="2" />
    <ellipse cx="150" cy="52" rx="13" ry="7" fill="url(#softLavender)" stroke="black" strokeWidth="1" transform="rotate(10 150 55)" />
    <text x="120" y="45" textAnchor="middle" alignmentBaseline="middle" fill="black" fontSize="12" fontFamily="Arial" fontWeight="bold">
      {counts.departmentMails}
    </text>
    <text x="150" y="53" textAnchor="middle" alignmentBaseline="middle" fill="black" fontSize="10" fontFamily="Arial" fontWeight="bold" transform="rotate(10 150 55)">
      {counts.sectionMails}
    </text>

    <text x="28" y="52" textAnchor="middle" fill="black" fontSize="14" fontFamily="Arial">
      {counts.personalMails}
    </text>
    <text x="385" y="55" textAnchor="middle" fill="black" fontSize="12" fontFamily="Arial">
      {counts.hasResponsibleUser}
    </text>
    <text x="478" y="52" textAnchor="middle" fill="black" fontSize="12" fontFamily="Arial">
      {counts.passwordKnown}
    </text>
  </svg>
);

export default ConverForGovUaSVG;
