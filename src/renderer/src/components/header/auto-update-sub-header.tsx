import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { SyncIcon } from "@primer/octicons-react";
import { Link } from "../link/link";
import * as styles from "./header.css";
import { AppUpdaterEvent } from "@types";

export const releasesPageUrl =
  "https://github.com/hydralauncher/hydra/releases/latest";

export function AutoUpdateSubHeader() {
  const [isReadyToInstall, setIsReadyToInstall] = useState(false);
  const [newVersion, setNewVersion] = useState<string | null>(null);
  const [isAutoInstallAvailable, setIsAutoInstallAvailable] = useState(false);

  const { t } = useTranslation("header");

  const handleClickInstallUpdate = () => {
    window.electron.restartAndInstallUpdate();
  };

  useEffect(() => {
    const unsubscribe = window.electron.onAutoUpdaterEvent(
      (event: AppUpdaterEvent) => {
        if (event.type == "update-available") {
          setNewVersion(event.info.version);
        }

        if (event.type == "update-downloaded") {
          setIsReadyToInstall(true);
        }
      }
    );

    window.electron.checkForUpdates().then((isAutoInstallAvailable) => {
      setIsAutoInstallAvailable(isAutoInstallAvailable);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!newVersion) return null;

  if (!isAutoInstallAvailable) {
    return (
      <header className={styles.subheader}>
        <Link to={releasesPageUrl} className={styles.newVersionLink}>
          <SyncIcon size={12} />
          <small>
            {t("version_available_download", { version: newVersion })}
          </small>
        </Link>
      </header>
    );
  }

  if (isReadyToInstall) {
    return (
      <header className={styles.subheader}>
        <button
          type="button"
          className={styles.newVersionButton}
          onClick={handleClickInstallUpdate}
        >
          <SyncIcon size={12} />
          <small>
            {t("version_available_install", { version: newVersion })}
          </small>
        </button>
      </header>
    );
  }

  return null;
}
