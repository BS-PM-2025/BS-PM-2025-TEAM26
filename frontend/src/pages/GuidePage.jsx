import React from "react";

export default function GuidePage() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  return (
    <div style={{ padding: "2rem" }}>
      <h1>ברוך הבא, {user?.username} (מדריך)</h1>
      <p>כאן תוכל לנהל את הסיורים, לראות תגובות, להפעיל ניווט ועוד.</p>

      {/* אזור דוגמאות - נחליף בפיצ'רים אמיתיים בהמשך */}
      <ul>
        <li>צפייה במבקרים שנרשמו לסיור</li>
        <li>יצירת מסלול מותאם אישית</li>
        <li>שליחת הודעות למבקרים</li>
      </ul>
    </div>
  );
}
