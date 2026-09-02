import ChangeUserStatusView from "./ChangeUserStatusView/ChangeUserStatusView";
import { Pages } from "../../../configs/app/constants";
import { setDataIsLoadedActionCreator } from "../../../redux/reducers/app-reducer";
import { useDispatch } from "react-redux";
import { fetchDictionariesThunk } from "../../../dal/api";

export default function ChangeUserStatus({
  selectedUserIds,
  onClose,
  onSubmit
  
}) {
const dispatch = useDispatch();


const handleConfirm = async () => {
  await onSubmit();

  Object.values(Pages).forEach((page) => {
    dispatch(setDataIsLoadedActionCreator(false, page));
  });

  dispatch(fetchDictionariesThunk());
};

  return (
    <ChangeUserStatusView
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}