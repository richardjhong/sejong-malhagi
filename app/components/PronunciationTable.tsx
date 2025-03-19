import React from "react";

interface TableRow {
  firstConsonant: string;
  followingSound: string;
  result: string;
  example: string;
}

interface PronunciationTableProps {
  title: string;
  rows: TableRow[];
  footnote?: string;
}

const PronunciationTable: React.FC<PronunciationTableProps> = ({
  title,
  rows,
  footnote,
}) => {
  return (
    <div className="overflow-x-auto mt-4">
      <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
        {title}
      </h4>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              First Syllable Final Consonant
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Following Syllable First Consonant
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Result
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Example
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0
                  ? "bg-white dark:bg-gray-900"
                  : "bg-gray-50 dark:bg-gray-800"
              }
            >
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                {row.firstConsonant}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                {row.followingSound}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                {row.result}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                {row.example}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {footnote && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
          {footnote}
        </p>
      )}
    </div>
  );
};

export default PronunciationTable;
