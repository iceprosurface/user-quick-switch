import { toaster } from "@kobalte/core";
import { Toast } from "@kobalte/core/toast";
import { AiOutlineClose } from "solid-icons/ai";
import { onCleanup } from "solid-js";

export function useSuccessToast() {
  let id: number = -1;
  const showSuccessToast = (name: string) => {
    id = toaster.show((props) => (
      <Toast toastId={props.toastId} class="toast">
        <div class="toast__content">
          <div>
            <Toast.Title class="toast__title">保存成功</Toast.Title>
            <Toast.Description class="toast__description">
              身份 {name} 已保存
            </Toast.Description>
          </div>
          <Toast.CloseButton class="toast__close-button">
            <AiOutlineClose />
          </Toast.CloseButton>
        </div>
        <Toast.ProgressTrack class="toast__progress-track">
          <Toast.ProgressFill class="toast__progress-fill" />
        </Toast.ProgressTrack>
      </Toast>
    ));
  };
  onCleanup(() => {
    toaster.dismiss(id);
  });
  return {
    showSuccessToast,
    Toast,
  };
}
