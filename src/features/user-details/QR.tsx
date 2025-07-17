export default function QR({
  onClose,
  base64Img,
}: {
  onClose: () => void;
  base64Img: string;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-2xl max-w-md w-full shadow-xl relative">
        <h2 className="text-2xl font-bold mb-4">
          {base64Img != '' ? 'QR Code' : 'QR Failed to Load'}
        </h2>
        <div className="flex justify-center">
          {base64Img != '' && (
            <img
              src={base64Img}
              alt="QR Code"
              className="w-48 h-48 object-contain"
            />
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
