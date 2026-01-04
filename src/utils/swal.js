import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const notification = {
  success: (title) => {
    Toast.fire({
      icon: "success",
      title: title,
      background: "#fff",
      iconColor: "#10b981",
    });
  },

  error: (title) => {
    Toast.fire({
      icon: "error",
      title: title,
      iconColor: "#dc2626",
    });
  },

  warning: (title) => {
    Toast.fire({
      icon: "warning",
      title: title,
      iconColor: "#f59e0b",
    });
  },

  confirm: async (title, text) => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy bỏ",
      customClass: {
        popup: "rounded-[2rem]",
      },
    });
    return result.isConfirmed;
  },
};
