import Swal from "sweetalert2";

type NoticeIcon =
  | "success"
  | "error"
  | "warning"
  | "info";


const isDarkMode = () =>
  document.documentElement.classList.contains(
    "dark",
  );


const baseConfig = () => {
  const dark = isDarkMode();

  return {
    width: 390,

    padding: "1.3rem 1.35rem 1.25rem",

    background: dark
      ? "rgba(12, 31, 23, 0.96)"
      : "rgba(251, 249, 245, 0.97)",

    color: dark
      ? "#edf5f0"
      : "#17231c",

    backdrop: dark
      ? "rgba(1, 10, 7, 0.72)"
      : "rgba(21, 38, 28, 0.38)",

    allowOutsideClick: false,
    allowEscapeKey: true,

    returnFocus: false,
    heightAuto: false,

    buttonsStyling: false,

    customClass: {
      container:
        "campus-swal-container",

      popup:
        "campus-swal-popup",

      icon:
        "campus-swal-icon",

      title:
        "campus-swal-title",

      htmlContainer:
        "campus-swal-text",

      actions:
        "campus-swal-actions",

      confirmButton:
        "campus-swal-confirm",

      cancelButton:
        "campus-swal-cancel",
    },
  };
};


/* =========================================================
   NOTICE
   ========================================================= */

export const notice = async (
  title: string,
  text = "",
  icon: NoticeIcon = "success",
) => {
  /*
   * Close any old SweetAlert instance first.
   * Prevents duplicated/stacked popup state.
   */
  if (Swal.isVisible()) {
    Swal.close();

    await new Promise<void>(
      (resolve) => {
        window.setTimeout(
          resolve,
          40,
        );
      },
    );
  }


  await Swal.fire({
    ...baseConfig(),

    title,
    text,
    icon,

    showConfirmButton: true,

    confirmButtonText: "OK",

    focusConfirm: true,

    didOpen: () => {
      /*
       * SweetAlert must remain interactive
       * even after a Radix dialog was just closed.
       */
      const container =
        document.querySelector<HTMLElement>(
          ".swal2-container",
        );

      if (container) {
        container.style.pointerEvents =
          "auto";

        container.style.zIndex =
          "999999";
      }
    },
  });
};


/* =========================================================
   CONFIRM ACTION
   ========================================================= */

export const confirmAction = async (
  title: string,
  text = "",
) => {
  if (Swal.isVisible()) {
    Swal.close();

    await new Promise<void>(
      (resolve) => {
        window.setTimeout(
          resolve,
          40,
        );
      },
    );
  }


  const result =
    await Swal.fire({
      ...baseConfig(),

      title,
      text,

      icon: "warning",

      showCancelButton: true,

      confirmButtonText:
        "Yes, continue",

      cancelButtonText:
        "Cancel",

      reverseButtons: true,

      focusConfirm: false,
      focusCancel: true,

      didOpen: () => {
        const container =
          document.querySelector<HTMLElement>(
            ".swal2-container",
          );

        if (container) {
          container.style.pointerEvents =
            "auto";

          container.style.zIndex =
            "999999";
        }
      },
    });


  return result.isConfirmed;
};