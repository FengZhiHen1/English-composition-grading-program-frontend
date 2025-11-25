import React from "react";

type Props = {
  visible: boolean;
  loading?: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const UploadConfirmModal: React.FC<Props> = ({
  visible,
  loading = false,
  title = "提示",
  description = "确认后会生成新的批改任务并开始上传。你可以在批改队列中查看进度与结果。是否现在提交？",
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    // 以最近的有定位父容器（root container 在 App.tsx 中设置了 `relative`）为参考
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-[70%] max-w-3xl bg-white rounded-xl shadow-2xl p-5 mx-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-3">{description}</p>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            disabled={loading}
          >
            取消
          </button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : null}
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadConfirmModal;
