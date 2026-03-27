import { useState } from "react";
import MainLayout from "@/components/templates/mainLayout/MainLayout";
import SettingsPanel from "@/components/organism/settingsPanel/SettingsPanel";
import ListAdmins from "@/components/organism/listAdmins/ListAdmins";
import UpdateCrendentials from "@/components/molecules/updateCrendentials/UpdateCrendentials";
import { UserRound, UsersRound } from "lucide-react";
import styles from "./Settings.module.css";
import { useUserStore } from "@/store/userStore";
import { hasRole } from "@/utils/auth";

const Settings = () => {
  const [activeView, setActiveView] = useState("settingsPanel");
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [credentialsTarget, setCredentialsTarget] = useState({
    userId: "",
    defaultUsername: "",
  });
  const { user } = useUserStore();
  const canViewAdmins = hasRole(user, 1);

  const views = [
    { id: "settingsPanel", label: "Mi perfil", icon: <UserRound size={16} /> },
    ...(canViewAdmins
      ? [
          {
            id: "listAdmins",
            label: "Administradores",
            icon: <UsersRound size={16} />,
          },
        ]
      : []),
  ];

  const handleOpenCredentials = (userId, defaultUsername = "") => {
    setCredentialsTarget({ userId, defaultUsername });
    setIsCredentialsModalOpen(true);
  };

  const handleCredentialsSubmit = (payload) => {
    // Reservado para integrar con API de actualizacion de credenciales.
    console.log("Credenciales actualizadas:", payload);
  };

  return (
    <MainLayout>
      <section className={styles.page}>
        <nav className={styles.viewsRow} aria-label="Opciones de configuracion">
          {views.map((item) => (
            <button
              key={item.id}
              className={`${styles.navButton} ${
                activeView === item.id ? styles.navButtonActive : ""
              }`}
              onClick={() => setActiveView(item.id)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <article className={styles.content}>
          {activeView === "settingsPanel" ? (
            <SettingsPanel onOpenCredentials={handleOpenCredentials} />
          ) : canViewAdmins ? (
            <ListAdmins onOpenCredentials={handleOpenCredentials} />
          ) : (
            <SettingsPanel onOpenCredentials={handleOpenCredentials} />
          )}
        </article>

        <UpdateCrendentials
          isOpen={isCredentialsModalOpen}
          userId={credentialsTarget.userId}
          defaultUsername={credentialsTarget.defaultUsername}
          onClose={() => setIsCredentialsModalOpen(false)}
          onSubmit={handleCredentialsSubmit}
        />
      </section>
    </MainLayout>
  );
};

export default Settings;
