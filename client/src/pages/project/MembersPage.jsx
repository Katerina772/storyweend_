import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useProjectContext } from "../../hooks/useProjectContext.js";
import { usePermissions } from "../../hooks/usePermissions.js";
import { projectsApi } from "../../api/projects.api.js";
import { InviteMemberModal } from "../../components/project/InviteMemberModal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { ASSIGNABLE_ROLES, getRoleInfo } from "../../utils/projectRoles.js";

export default function MembersPage() {
  const { projectId } = useParams();
  const project = useProjectContext();
  const { canManageMembers, role: myRole } = usePermissions();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [removingMember, setRemovingMember] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { members } = await projectsApi.listMembers(projectId);
      setMembers(members);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити учасників");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRoleChange = async (newRole) => {
    if (!editingMember) return;
    setActionLoading(true);
    try {
      const { member } = await projectsApi.updateMemberRole(
        projectId,
        editingMember.id,
        newRole,
      );
      setMembers((prev) => prev.map((m) => (m.id === member.id ? member : m)));
      setEditingMember(null);
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося змінити роль");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!removingMember) return;
    setActionLoading(true);
    try {
      await projectsApi.removeMember(projectId, removingMember.id);
      setMembers((prev) => prev.filter((m) => m.id !== removingMember.id));
      setRemovingMember(null);
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося видалити учасника");
    } finally {
      setActionLoading(false);
    }
  };

  const existingEmails = members.map((m) => m.user.email.toLowerCase());

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Учасники</h1>
          <p className="text-sm text-slate-400 mt-1">
            {members.length} учасників у проєкті «{project.name}»
          </p>
        </div>
        {canManageMembers && (
          <Button onClick={() => setInviteOpen(true)}>
            + Запросити учасника
          </Button>
        )}
      </div>

      {/* Пояснення ролей */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase mb-3">
          Ролі та права
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries({
            OWNER: getRoleInfo("OWNER"),
            EDITOR: getRoleInfo("EDITOR"),
            AUTHOR: getRoleInfo("AUTHOR"),
            VIEWER: getRoleInfo("VIEWER"),
          }).map(([key, info]) => (
            <div key={key}>
              <Badge color={info.color}>{info.label}</Badge>
              <p className="text-xs text-slate-500 mt-1">{info.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Список учасників */}
      <div className="flex flex-col gap-2">
        {members.map((m) => {
          const info = getRoleInfo(m.role);
          const isMe =
            String(m.user.id) === String(project.ownerId) && m.role === "OWNER";

          return (
            <div
              key={m.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                  {m.user.avatar ? (
                    <img
                      src={m.user.avatar}
                      alt={m.user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-slate-500 text-sm">
                      {m.user.username[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-100 font-medium truncate">
                      {m.user.username}
                    </span>
                    {m.role === "OWNER" && (
                      <span className="text-xs text-yellow-400">👑</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {m.user.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge color={info.color}>{info.label}</Badge>

                {canManageMembers && m.role !== "OWNER" && (
                  <>
                    <button
                      onClick={() => setEditingMember(m)}
                      className="text-slate-400 hover:text-slate-100 text-sm px-2"
                      title="Змінити роль"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => setRemovingMember(m)}
                      className="text-red-400 hover:text-red-300 text-sm px-2"
                      title="Видалити з проєкту"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Модалка запрошення */}
      <InviteMemberModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onCreated={(member) => setMembers((prev) => [...prev, member])}
        existingEmails={existingEmails}
      />

      {/* Модалка зміни ролі */}
      <Modal
        open={!!editingMember}
        onClose={() => setEditingMember(null)}
        title={`Змінити роль: ${editingMember?.user?.username || ""}`}
      >
        <div className="flex flex-col gap-2">
          {ASSIGNABLE_ROLES.map((r) => {
            const info = getRoleInfo(r);
            const current = editingMember?.role === r;
            return (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                disabled={actionLoading || current}
                className={`text-left px-3 py-2 rounded border transition disabled:opacity-50 ${
                  current
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-700 bg-slate-800 hover:bg-slate-750"
                }`}
              >
                <div className="font-medium text-slate-100 text-sm flex items-center gap-2">
                  {info.label}
                  {current && (
                    <span className="text-xs text-blue-400">
                      (поточна роль)
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {info.description}
                </div>
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Модалка підтвердження видалення */}
      <Modal
        open={!!removingMember}
        onClose={() => setRemovingMember(null)}
        title="Видалити учасника?"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setRemovingMember(null)}
              disabled={actionLoading}
            >
              Скасувати
            </Button>
            <Button
              variant="danger"
              onClick={handleRemove}
              disabled={actionLoading}
            >
              {actionLoading ? "Видалення..." : "Видалити"}
            </Button>
          </>
        }
      >
        <p>
          Ви впевнені, що хочете видалити{" "}
          <strong className="text-slate-100">
            {removingMember?.user?.username}
          </strong>{" "}
          з проєкту?
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Користувач втратить доступ до проєкту. Створений ним контент
          залишиться.
        </p>
      </Modal>
    </div>
  );
}
