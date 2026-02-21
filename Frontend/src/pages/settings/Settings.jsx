import { useMemo, useState } from "react";
import MainLayout from "@/components/templates/mainLayout/MainLayout";
import SettingsPanel from "@/components/organism/settingsPanel/SettingsPanel";
import ListAdmins from "@/components/organism/listAdmins/ListAdmins";
import styles from "./Settings.module.css";

const Settings = () => {
  const [activeView, setActiveView] = useState("settingsPanel");

  const views = [
    { id: "settingsPanel", label: "Mi perfil" },
    { id: "listAdmins", label: "Administradores" },
  ];
  return (
    <MainLayout>
      <section className={styles.page}>
        <section className={styles.layout}>
          <aside className={styles.internalSidebar}>
            <h3 className={styles.sidebarTitle}>Opciones</h3>
            <nav className={styles.nav}>
              {views.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.navButton} ${
                    activeView === item.id ? styles.navButtonActive : ""
                  }`}
                  onClick={() => setActiveView(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          <article className={styles.content}>
            {activeView === "settingsPanel" ? (
              <SettingsPanel />
            ) : (
              <ListAdmins />
            )}
          </article>
        </section>
      </section>
    </MainLayout>
  );
};

export default Settings;
