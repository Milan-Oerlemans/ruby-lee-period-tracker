import { useContext, useEffect, useState } from "react";
import {
  IonAlert,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import {
  colorFillOutline,
  serverOutline,
} from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { SettingsContext, ThemeContext } from "../state/Context";

const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { theme, updateTheme } = useContext(ThemeContext);

  const themesList = [];
  for (const item of ["light", "dark"]) {
    themesList.push(
      <IonSelectOption
        key={item}
        value={item}
      >
        {item}
      </IonSelectOption>,
    );
  }

  return (
    <IonItem>
      <IonIcon
        slot="start"
        icon={colorFillOutline}
        color={`text-${theme}`}
      />

      <IonSelect
        className={theme}
        value={theme === "basic" ? "light" : theme}
        interface="popover"
        justify="space-between"
        interfaceOptions={{
          cssClass: theme,
        }}
        onIonChange={(event) => updateTheme(event.target.value as string)}
      >
        <div slot="label">
          <IonText color={`text-${theme}`}>{t("Theme")}</IonText>
        </div>
        {themesList}
      </IonSelect>
    </IonItem>
  );
};

const CycleCountSelector = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { maxNumberOfDisplayedCycles, updateMaxNumberOfDisplayedCycles } =
    useContext(SettingsContext);

  const [selectedCount, setSelectedCount] = useState(6);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    setSelectedCount(maxNumberOfDisplayedCycles);
  }, [maxNumberOfDisplayedCycles]);

  const countList = [];
  for (const item of [6, 12, 24]) {
    countList.push(
      <IonSelectOption
        key={item}
        value={item}
      >
        {item}
      </IonSelectOption>,
    );
  }

  return (
    <IonItem>
      <IonIcon
        slot="start"
        icon={serverOutline}
        color={`text-${theme}`}
      />

      <IonSelect
        className={theme}
        value={selectedCount}
        interface="popover"
        justify="space-between"
        interfaceOptions={{
          cssClass: theme,
        }}
        onIonChange={(event) => {
          setPendingCount(Number(event.target.value));
          setIsAlertOpen(true);

          // NOTE: Reset value to selectedCount to prevent flickering:
          // the browser shows the new value first, but React replaces it with the old one before confirmation in IonAlert.
          event.target.value = selectedCount;
        }}
      >
        <div slot="label">
          <IonText
            color={`text-${theme}`}
          >{`${t("Stored cycles count")} (β)`}</IonText>
        </div>
        {countList}
      </IonSelect>
      <IonAlert
        isOpen={isAlertOpen}
        header={t("Confirm selection")}
        subHeader={t(
          "Are you sure you want to change the number of stored cycles?",
        )}
        message={t("Reducing the number will permanently remove some cycles.")}
        cssClass="custom-alert"
        buttons={[
          {
            text: t("cancel"),
            role: "cancel",
            handler: () => {
              setPendingCount(null);
            },
          },
          {
            text: "OK",
            role: "confirm",
            handler: () => {
              if (pendingCount !== null) {
                setSelectedCount(pendingCount);
                updateMaxNumberOfDisplayedCycles(pendingCount);
              }
            },
          },
        ]}
        onDidDismiss={() => setIsAlertOpen(false)}
      ></IonAlert>
    </IonItem>
  );
};

interface MenuProps {
  contentId: string;
}

export const Menu = (props: MenuProps) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext).theme;

  return (
    <IonMenu
      contentId={props.contentId}
      className={theme}
    >
      <IonList
        lines="none"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <IonItem lines="full">
          <IonLabel color={`dark-${theme}`}>{t("Preferences")}</IonLabel>
        </IonItem>
        <ThemeSwitcher />
        <CycleCountSelector />
      </IonList>
    </IonMenu>
  );
};
