import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { closeAlert } from "@/features/alertSlice";

export default function AlertModal() {
  const dispatch = useDispatch();
  const alert = useSelector((state: RootState) => state.alert);

  if (!alert.isOpen) return null;

  const handleCancelClick = () => {
    alert.onNegative?.();
    dispatch(closeAlert());
  };

  const handleActionClick = () => {
    alert.onPositive?.();
    dispatch(closeAlert());
  };

  return (
    <AlertDialog open={alert.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alert.title}</AlertDialogTitle>
          <AlertDialogDescription>{alert.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelClick}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleActionClick}>
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
