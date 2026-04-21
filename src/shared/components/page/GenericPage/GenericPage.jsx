import  { useRef, useMemo } from "react";
import TopTableBar from "../../../../Components/Content/TopTableBar/TopTableBar";
import { rowsPerPage } from "../../../../configs/app/constants";
import { useIndexesForPage, usePageNumber } from "../../../../redux/hooks/hooks";
import { pageConfigs } from "../../../../configs/app/pageConfig";
import { connect } from "react-redux";
import { getDepartmentsAndSectionsPerPage } from "../../../../redux/selectors/selector";
import { PageContext } from "../../../../redux/contexts/useConetxt";
import { BottomFilterContainer } from "../../../../Components/Content/BottomFilter/BottomFilterContainer";
import s from "./GenericPage.module.css"


const GenericPage = ({
  pageName,
  showPasswords,
  passwordsMap,
  getDepartmentsAndSectionsPerPage
}) => {
  const titleRef = useRef(null);
  const pageNumber = usePageNumber();

  const indexes = useIndexesForPage(pageName);
  

  const config = pageConfigs[pageName];
  


  // 🔹 memo для sharedProps → TableComponent і PageContext отримують однакові об’єкти
  const sharedProps = useMemo(() => ({
    titleRef,
    columns: config.columns,
    rowsPerPage,
    pageNumber,
    pageName,
    ...(config.needsDepartments && { departmentsAndSectionsPerPage: getDepartmentsAndSectionsPerPage(pageName) }),
    ...(showPasswords !== undefined && { showPasswords }),
    ...(passwordsMap !== undefined && { passwordsMap }),
  }), [
    titleRef,
    config.columns,
    rowsPerPage,
    pageNumber,
    pageName,
    config.needsDepartments,
    showPasswords,
    passwordsMap
  ]);

  // 🔹 memo для PageContext
  const pageContextValue = useMemo(() => ({
    ...sharedProps,
    indexesOfFoundResultsForCurrentPage: indexes
  }), [sharedProps, indexes]);

  
return (
  <div className={s.pageWrapper}>
    <TopTableBar ref={titleRef} title={config.title} pageName={pageName} />

    <div className={s.pageContent}>
      <PageContext.Provider value={pageContextValue}>
        <config.TableComponent {...sharedProps} />
      </PageContext.Provider>
    </div>

    <div className={s.bottomWrapper}>
      <BottomFilterContainer />
    </div>
  </div>
);
};

const mapStateToProps = (state) => ({
  getDepartmentsAndSectionsPerPage: (menu) =>
    getDepartmentsAndSectionsPerPage(state, menu),
});

export default connect(mapStateToProps)(GenericPage);
