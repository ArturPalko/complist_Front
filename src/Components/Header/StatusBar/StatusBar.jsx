import { connect } from "react-redux";
import { getCountOfPresentedElement, activeMenu } from "../../../redux/selectors/selector";
import s from "./StatusBar.module.css";
import contacts from "../../../assets/contacts.png";
import aca from "../../../assets/aca.png";

const StatusBar = ({ counts, activeMenu }) => {
  return (
    <div className={s.info} style={{ display: "flex", gap: "20px", alignItems: "center" }}>
      {activeMenu === "phones" && (
        <>
<svg width="400" height="60">
  <defs>
    <clipPath id="leftHalf">
      <rect x="0" y="0" width="200" height="60" />
    </clipPath>

    <clipPath id="rightHalf">
      <rect x="200" y="0" width="200" height="60" />
    </clipPath>
  </defs>

  <ellipse cx="200" cy="30" rx="200" ry="30" fill="lightblue" clipPath="url(#leftHalf)" />
  <ellipse cx="200" cy="30" rx="200" ry="30" fill="lightyellow" clipPath="url(#rightHalf)" />

  <rect x={117} y={25} width={60} height={20} fill="rgb(156, 156, 238)" >
    <tex>{counts.countOfSections}</tex>
  </rect>
  
  <text
  x={117 + 60 / 2}       
  y={27 + 20 / 2}        
  fill="black"
  fontSize="14"
  fontFamily="Arial"
  dominantBaseline="middle"
  textAnchor="middle"
>
  {counts.countOfDepartments}
</text>
<text
  x={10}
  y={30}
  fill="black"
  fontSize="14"
  fontFamily="Arial"
  dominantBaseline="middle"
>
  Самостійні
</text>


 <text x="150" y="15" fill="black" >Підрозділи</text>
<rect x={220} y={25} width={60} height={20} fill="rgb(252, 195, 89)" />

<text
  x={220 + 60 / 2}       
  y={27 + 20 / 2}        
  fill="black"
  fontSize="14"
  fontFamily="Arial"
  dominantBaseline="middle"
  textAnchor="middle"
>
  {counts.countOfSections}
</text>


<text
  x={295}
  y={30}
  fill="black"
  fontSize="14"
  fontFamily="Arial"
  dominantBaseline="middle"
>
  Не самостійні
</text>

    <line x1="140" y1="18" x2="235" y2="18" stroke="black" strokeWidth="1" />
</svg>

          {/* Контакти */}
          <svg width="200" height="60">
            <ellipse cx="100" cy="30" rx="100" ry="30" fill="pink" />
            <image href={contacts} x="20" y="15" width="30" height="30" />
            rect
            <text 
              x="60" 
              y="30" 
              fill="black" 
              fontSize="14" 
              fontFamily="Arial" 
              dominantBaseline="middle"
              
            >
              Контакти:
            </text>
             <rect x={127} y={20} width={30} height={20} fill="beige"/ >
                 <text
                    x={117 + 50 / 2}       
                    y={22 + 20 / 2}        
                    fill="black"
                    fontSize="14"
                    fontFamily="Arial"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    
                    >
                    {counts.countOfUsers}
                </text>
            <line x1="60" y1="37" x2="120" y2="37" stroke="black" strokeWidth="1" />
    
          </svg>

            {/* Контакти */}
   <svg width="200" height="60">
     
  <defs>
    <pattern id="threeStripes" patternUnits="userSpaceOnUse" width="200" height="60">
      <rect x="0" width="66.66" height="60" fill="white"/>
      <rect x="66.66" width="66.66" height="60" fill="rgba(79, 98, 98, 1)"/>
      <rect x="133.32" width="66.68" height="60" fill="white"/>
    </pattern>
  </defs>
  
  <ellipse cx="100" cy="30" rx="100" ry="30" fill="url(#threeStripes)" />
    {/* <line  x1="67" y1="20" x2="133" y2="20" stroke="white" strokeWidth="1" /> */}
    <rect x={82} y={35} width={40} height={20} fill="white" />
    <rect x={25} y={30} width={30} height={20} fill="black"  transform="rotate(-10,30,25)" />
    <rect x={125} y={8} width={30} height={20} fill="black" transform="rotate(10,30,125)" />
   
    
    
  <text x="33.33" y="30" font-size="18" text-anchor="middle" fill="black" font-family="Arial" transform="rotate(-20, 15, 30)">Міські</text>
      <text x="40" y="50" font-size="14" text-anchor="middle" fill="white" font-family="Arial" transform="rotate(-12, 15, 30)">{counts.countOfLandlinePhones} </text>
  <text x="100" y="25" font-size="14" text-anchor="middle" fill="white" font-family="Arial">Внутрішні </text>
    <text x="100" y="50" font-size="14" text-anchor="middle" fill="black" font-family="Arial">{counts.countOfInternalPhones} </text>
  <text x="166.66" y="37" font-size="18" text-anchor="middle" fill="black" font-family="Arial" transform="rotate(20, 200, 30)">IP Cisco</text>
      <text x="135" y="20" font-size="14" text-anchor="middle" fill="white" font-family="Arial" transform="rotate(12,30,125)"  >{counts.countOfCiscoPhones} </text>
</svg>



        </>
      )}

      {activeMenu === "lotus" && (
        <svg width="500" height="60" viewBox="0 0 500 60" xmlns="http://www.w3.org/2000/svg">
  <path d="M10,5 H490 Q495,5 495,15 V55 Q495,60 490,60 H10 Q5,60 5,55 V15 Q5,5 10,5 Z"
        fill="rgba(255,235,180,0.9)"
        stroke="rgba(200,180,120,0.9)"
        stroke-width="2"/>
  <path d="M10,30 L250,55 L490,30"
        fill="none"
        stroke="rgba(150,100,50,0.8)"
        stroke-width="1.2"/>
  <line x1="100"  y1="15" x2="100"  y2="55" stroke="rgba(150,100,50,0.6)" stroke-width="1"/>
  <line x1="180" y1="15" x2="180" y2="55" stroke="rgba(150,100,50,0.6)" stroke-width="1"/>
  <line x1="320" y1="15" x2="320" y2="55" stroke="rgba(150,100,50,0.6)" stroke-width="1"/>
  <line x1="400" y1="15" x2="400" y2="55" stroke="rgba(150,100,50,0.6)" stroke-width="1"/>

  <rect x="180" y="15" width="140" height="45" rx="5" ry="5" fill="white" opacity="0.15" stroke="rgba(150,100,50,0.9)" stroke-width="1.2"/>
  <text x="250" y="32" text-anchor="middle" fill="black" font-size="18" font-family="Arial" font-weight="bold">{counts.countOfLotus}</text>
  {/* <text x="250" y="48" text-anchor="middle" fill="black" font-size="12" font-family="Arial">Службових</text> */}

  <text x="55"  y="32" text-anchor="middle" fill="black" font-size="17" font-family="Arial" transform="rotate(8 55 32)">Персональні</text>
  <text x="140" y="28" text-anchor="middle" fill="black" font-size="17" font-family="Arial" transform="rotate(8 140 28)">Підрозділу</text>
  {/* <text x="250" y="32" text-anchor="middle" fill="black" font-size="17" font-family="Arial">Скриньки</text>///////////////////////////////////////////////////////////// */}
  <image href={aca} x="200" y="15" width="30" height="30" />
  <text x="270"  y="50" text-anchor="middle" fill="black" font-size="17" font-family="Arial"  transform="rotate(-6 255 50)">Скриньок</text>
        
<text x="360" y="26" text-anchor="middle" fill="black" font-size="17" font-family="Arial" transform="rotate(-8 360 32)">
  <tspan x="360" dy="0">Має</tspan>
  <tspan x="360" dy="14">нову назву</tspan>
</text>

  <text x="470" y="20" text-anchor="middle" fill="black" font-size="17" font-family="Arial"transform="rotate(-8 445 32)" > 
    <tspan x="440" dy="0">Пароль</tspan>
  <tspan x="460" dy="14">відомий</tspan>
  </text>
  <rect x="15"  y="35" width="25" height="22" rx="3" ry="3" fill="white" opacity="0.8"/>
  {/* <rect x="125" y="42" width="22" height="14" rx="3" ry="3" fill="white" opacity="0.8"/> */}

  <g >
    <defs>
    <radialGradient id="stoneBlue" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7da0b3"/>
      <stop offset="100%" stop-color="#4d6b7a"/>
    </radialGradient>
    <radialGradient id="stoneGreen" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a3c59f"/>
      <stop offset="100%" stop-color="#658a5e"/>
    </radialGradient>
  </defs>
    <circle cx="120" cy="45" r="14" fill="url(#stoneBlue)" stroke="black" stroke-width="2" />
    <ellipse cx="150" cy="52" rx="13" ry="7" fill="url(#stoneGreen)" stroke="black" stroke-width="1" transform="rotate(10 150 55)"/>
    
    <text x="120" y="45" text-anchor="middle" alignment-baseline="middle" fill="white" font-size="12" font-family="Arial" font-weight="bold">{counts.departmentMailsOfLotus}</text>
    <text x="150" y="53" text-anchor="middle" alignment-baseline="middle" fill="white" font-size="10" font-family="Arial" font-weight="bold" transform="rotate(10 150 55)">{counts.sectionMailsOfLotus}</text>
  </g>


  <rect x="375" y="44" width="22" height="14" rx="3" ry="3" fill="white" opacity="0.8"/>
  <rect x="465" y="35" width="25" height="22" rx="3" ry="3" fill="white" opacity="0.8"/>

  <text x="28"  y="52" text-anchor="middle" fill="black" font-size="14" font-family="Arial">{counts.personalMailsOfLotus}</text>
  {/* <text x="125" y="53" text-anchor="middle" fill="black" font-size="12" font-family="Arial">8</text> */}
  <text x="385" y="55" text-anchor="middle" fill="black" font-size="12" font-family="Arial">{counts.hasNewPostName}</text>
  <text x="478" y="52" text-anchor="middle" fill="black" font-size="12" font-family="Arial">{counts.passwordKnown}</text>
</svg>

      )}

      {activeMenu === "gov-ua" && (
        
        <svg width="500" height="60" viewBox="0 0 500 60" xmlns="http://www.w3.org/2000/svg">
  <path d="M10,5 H490 Q495,5 495,15 V55 Q495,60 490,60 H10 Q5,60 5,55 V15 Q5,5 10,5 Z"
         fill="url(#softUkraineFlag)"
        stroke="rgba(56, 11, 170, 0.9)"
        stroke-width="2"/>
  <path d="M10,30 L250,55 L490,30"
        fill="none"
        stroke="rgba(56, 11, 170, 0.9)"
        stroke-width="1.2"/>
          <defs>
     <defs>
    <linearGradient id="softUkraineFlag" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6ec6ff"/>   
      <stop offset="50%" stop-color="#6ec6ff"/>
      <stop offset="50%" stop-color="#ffe97d"/>   
      <stop offset="100%" stop-color="#ffe97d"/>
    </linearGradient>
  </defs>
  </defs>
  <line x1="100"  y1="15" x2="100"  y2="55" stroke="rgba(56, 11, 170, 0.9)" stroke-width="1"/>
  <line x1="180" y1="15" x2="180" y2="55" stroke="rgba(56, 11, 170, 0.9)" stroke-width="1"/>
  <line x1="320" y1="15" x2="320" y2="55" stroke="rgba(56, 11, 170, 0.9)" stroke-width="1"/>
  <line x1="400" y1="15" x2="400" y2="55"  stroke="rgba(56, 11, 170, 0.9)" stroke-width="1"/>

  <rect x="180" y="15" width="140" height="45" rx="5" ry="5" fill="white" opacity="0.15" stroke="rgba(56, 11, 170, 0.9)" stroke-width="1.2"/>
  <text x="210" y="40" text-anchor="middle" fill="black" font-size="18" font-family="Arial" font-weight="bold">{counts.countOfLotus}</text>
  {/* <text x="250" y="48" text-anchor="middle" fill="black" font-size="12" font-family="Arial">Службових</text> */}

  <text x="55"  y="32" text-anchor="middle" fill="black" font-size="17" font-family="Arial" transform="rotate(8 55 32)">Персональні</text>
  <text x="140" y="28" text-anchor="middle" fill="black" font-size="17" font-family="Arial" transform="rotate(8 140 28)">Підрозділу</text>
  {/* <text x="250" y="32" text-anchor="middle" fill="black" font-size="17" font-family="Arial">Скриньки</text>///////////////////////////////////////////////////////////// */}
  <text x="220"  y="20" text-anchor="middle" fill="white" font-size="17" font-family="Arial" >
    <tspan  dy="0">gov</tspan>
     <tspan  dy="0" font-weight="bold">.</tspan>
    <tspan  dy="0">UA</tspan>
  </text>
  <text x="290"  y="20" text-anchor="middle" fill="black" font-size="17" font-family="Arial" >Скриньок</text>
        
<text x="300" y="26" text-anchor="middle" fill="black" font-size="17" font-family="Arial" transform="rotate(-8 360 32)" >
  <tspan x="360" dy="0">Має</tspan>
  <tspan x="340" dy="14" >відпов. особу</tspan>
</text>

  <text x="470" y="20" text-anchor="middle" fill="black" font-size="17" font-family="Arial"transform="rotate(-8 445 32)" > 
    <tspan x="440" dy="0">Пароль</tspan>
  <tspan x="460" dy="14">відомий</tspan>
  </text>
  <rect x="15"  y="35" width="25" height="22" rx="3" ry="3" fill="white" opacity="0.8"/>
  {/* <rect x="125" y="42" width="22" height="14" rx="3" ry="3" fill="white" opacity="0.8"/> */}

  <g >
  <defs>
    
    <radialGradient id="brightTurquoise" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#b3f5ec"/>
      <stop offset="100%" stop-color="#4fd1b6"/>
    </radialGradient>

 
    <radialGradient id="softLavender" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e8d9ff"/>
      <stop offset="100%" stop-color="#b497e6"/>
    </radialGradient>
  </defs>
    <circle cx="120" cy="45" r="14" fill="url(#brightTurquoise)" stroke="black" stroke-width="2" />
    <ellipse cx="150" cy="52" rx="13" ry="7" fill="url(#softLavender)" stroke="black" stroke-width="1" transform="rotate(10 150 55)"/>
    
    <text x="120" y="45" text-anchor="middle" alignment-baseline="middle" fill="black" font-size="12" font-family="Arial" font-weight="bold">{counts.departmentMailsOfLotus}</text>
    <text x="150" y="53" text-anchor="middle" alignment-baseline="middle" fill="black" font-size="10" font-family="Arial" font-weight="bold" transform="rotate(10 150 55)">{counts.sectionMailsOfLotus}</text>
  </g>


  <rect x="375" y="44" width="22" height="14" rx="3" ry="3" fill="white" opacity="0.8"/>
  <rect x="465" y="35" width="25" height="22" rx="3" ry="3" fill="white" opacity="0.8"/>

  <text x="28"  y="52" text-anchor="middle" fill="black" font-size="14" font-family="Arial">{counts.personalMailsOfLotus}</text>
  {/* <text x="125" y="53" text-anchor="middle" fill="black" font-size="12" font-family="Arial">8</text> */}
  <text x="385" y="55" text-anchor="middle" fill="black" font-size="12" font-family="Arial">{counts.hasNewPostName}</text>
  <text x="478" y="52" text-anchor="middle" fill="black" font-size="12" font-family="Arial">{counts.passwordKnown}</text>
</svg>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  counts: getCountOfPresentedElement(state, activeMenu(state).toLowerCase()),
  activeMenu: activeMenu(state).toLowerCase(),
});

export default connect(mapStateToProps)(StatusBar);
