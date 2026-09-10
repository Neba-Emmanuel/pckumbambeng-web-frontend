import Swal from "sweetalert2";

interface ISweetAlert {
  icon: "success" | "error" | "warning" | "info" | "question";
  title: string;
  timer?: number;
}

export default function sweetAlert({
  icon,
  title,
  timer = 2500,
}: ISweetAlert): void {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  Toast.fire({
    icon,
    title,
  });
}

export const showConfirmationDialog = async (title: string, text: string) => {
  return Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
  });
};
