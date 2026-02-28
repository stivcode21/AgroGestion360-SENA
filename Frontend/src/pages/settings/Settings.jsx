import { useState } from "react";
import MainLayout from "@/components/templates/mainLayout/MainLayout";
import SettingsPanel from "@/components/organism/settingsPanel/SettingsPanel";
import ListAdmins from "@/components/organism/listAdmins/ListAdmins";
import UpdateCrendentials from "@/components/molecules/updateCrendentials/UpdateCrendentials";
import { UserRound, UsersRound } from "lucide-react";
import { settingsProfileInitialValues } from "@/data/settingsProfileData";
import styles from "./Settings.module.css";

const Settings = () => {
  const [activeView, setActiveView] = useState("settingsPanel");
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [credentialsTarget, setCredentialsTarget] = useState({
    userId: settingsProfileInitialValues.document,
    defaultUsername: settingsProfileInitialValues.name,
  });

  const views = [
    { id: "settingsPanel", label: "Mi perfil", icon: <UserRound size={16} /> },
    {
      id: "listAdmins",
      label: "Administradores",
      icon: <UsersRound size={16} />,
    },
  ];

  const handleOpenCredentials = ({ userId, defaultUsername }) => {
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
          ) : (
            <ListAdmins onOpenCredentials={handleOpenCredentials} />
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
