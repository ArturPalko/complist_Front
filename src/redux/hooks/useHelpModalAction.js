import { useModalWindowContext } from "../contexts/useConetxt";

export const useHelpModalAction = () => {
  const { openModal } = useModalWindowContext();

  const openHelpModal = () => {
    openModal({
      type: "searchHelp",
    });
  };

  return {
    openHelpModal,
  };
};
