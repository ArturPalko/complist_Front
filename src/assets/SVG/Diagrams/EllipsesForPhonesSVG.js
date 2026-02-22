import contacts from "../../../assets/Img/contacts.png";

const EllipsesForPhonesSVG = ({ counts }) => (
  <div style={{ display: "flex", gap: "7.5px" }}>
    {/* Підрозділи */}
    <svg width="300" height="45">
      <defs>
        <clipPath id="leftHalf">
          <rect x="0" y="0" width="150" height="45" />
        </clipPath>
        <clipPath id="rightHalf">
          <rect x="150" y="0" width="150" height="45" />
        </clipPath>
      </defs>

      <ellipse cx="150" cy="22.5" rx="150" ry="22.5" fill="lightblue" clipPath="url(#leftHalf)" />
      <ellipse cx="150" cy="22.5" rx="150" ry="22.5" fill="lightyellow" clipPath="url(#rightHalf)" />

      <rect x={87.75} y={18.75} width={45} height={15} fill="rgb(156,156,238)" />
      <text x={87.75 + 45 / 2} y={18.75 + 15 / 2} fill="black" fontSize="10.5" fontFamily="Arial" dominantBaseline="middle" textAnchor="middle">
        {counts.countOfDepartments}
      </text>

      <text x="7.5" y="22.5" fill="black" fontSize="10.5" fontFamily="Arial" dominantBaseline="middle">
        Самостійні
      </text>

      <text x="112.5" y="11.25" fill="black">Підрозділи</text>
      <rect x={165} y={18.75} width={45} height={15} fill="rgb(252,195,89)" />
      <text x={165 + 45 / 2} y={18.75 + 15 / 2} fill="black" fontSize="10.5" fontFamily="Arial" dominantBaseline="middle" textAnchor="middle">
        {counts.countOfSections}
      </text>
      <text x="221.25" y="22.5" fill="black" fontSize="10.5" fontFamily="Arial" dominantBaseline="middle">
        Не самостійні
      </text>

      <line x1="105" y1="13.5" x2="176.25" y2="13.5" stroke="black" strokeWidth="0.75" />
    </svg>

    {/* Контакти */}
    <svg width="150" height="45">
      <ellipse cx="75" cy="22.5" rx="75" ry="22.5" fill="pink" />
      <image href={contacts} x="15" y="11.25" width="22.5" height="22.5" />
      <text x="68" y="22.5" fill="black" fontSize="10.5" fontFamily="Arial" dominantBaseline="middle" textAnchor="middle">
        Контакти:
      </text>
      <rect x={95.25} y={15} width={22.5} height={15} fill="beige" />
      <text x={87.75 + 37.5 / 2} y={16.5 + 15 / 2} fill="black" fontSize="10.5" fontFamily="Arial" dominantBaseline="middle" textAnchor="middle">
        {counts.countOfUsers}
      </text>
      <line x1="45" y1="27.75" x2="90" y2="27.75" stroke="black" strokeWidth="0.75" />
    </svg>

    {/* Телефони */}
    <svg width="150" height="45">
      <defs>
        <pattern id="threeStripes" patternUnits="userSpaceOnUse" width="150" height="45">
          <rect x="0" width="50" height="45" fill="white" />
          <rect x="50" width="50" height="45" fill="rgba(79,98,98,1)" />
          <rect x="100" width="50" height="45" fill="white" />
        </pattern>
      </defs>
      <ellipse cx="75" cy="22.5" rx="75" ry="22.5" fill="url(#threeStripes)" />
      <rect x={61.5} y={26.25} width={30} height={15} fill="white" />
      <rect x={18.75} y={22.5} width={22.5} height={15} fill="black" transform="rotate(-7.5,30,18.75)" />
      <rect x={96.75} y={10} width={22.5} height={15} fill="black" transform="rotate(7.5,22.5,93.75)" />

      <text x="25" y="22.5" fontSize="13.5" textAnchor="middle" fill="black" fontFamily="Arial" transform="rotate(-15,11.25,22.5)">
        Міські
      </text>
      <text x="30" y="37.5" fontSize="10.5" textAnchor="middle" fill="white" fontFamily="Arial" transform="rotate(-9,11.25,22.5)">
        {counts.countOfLandlinePhones}
      </text>
      <text x="75" y="18.75" fontSize="10.5" textAnchor="middle" fill="white" fontFamily="Arial">Внутрішні</text>
      <text x="75" y="37.5" fontSize="10.5" textAnchor="middle" fill="black" fontFamily="Arial">{counts.countOfInternalPhones}</text>
      <text x="125" y="27.75" fontSize="13.5" textAnchor="middle" fill="black" fontFamily="Arial" transform="rotate(20,150,22.5)">
        IP Cisco
      </text>
      <text x="106.25" y="20" fontSize="10.5" textAnchor="middle" fill="white" fontFamily="Arial" transform="rotate(9,22.5,93.75)">
        {counts.countOfCiscoPhones}
      </text>
    </svg>
  </div>
);

export default EllipsesForPhonesSVG;



