export default function HelpPower({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-2xl max-w-md w-full shadow-xl relative">
        <h2 className="text-2xl font-bold mb-4">⚡ Power Mode Shortcuts</h2>
        <ul className="list-disc pl-6 space-y-2 text-left text-sm">
          <li>
            <b>0–9</b>: Rate current category
          </li>
          <li>
            <b>W</b>: Previous category
          </li>
          <li>
            <b>S</b>: Next category
          </li>
          <li>
            <b>A</b>: Submit current score
          </li>
          <li>
            <b>D</b>: Go to next applicant
          </li>
          <li>
            <b>ESC</b>: Exit Power Mode
          </li>
        </ul>
        <p className="pt-3 pl-5 space-y-2 text-left text-sm">
          Note: the current category box will be outlined in yellow
        </p>
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
