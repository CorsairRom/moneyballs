import { useQuasar } from 'quasar';
import { useCurrencify } from './useCurrencify';
import { useAmountColorClass } from './useAmountColorClass';
import type { Entry as FinancialEntry } from 'src/models/entryModels';

type DialogType = 'confirmation';
type ButtonConfig = {
  label: string;
  color: string;
  noCaps?: boolean;
};

interface DialogConfig {
  type: DialogType;
  title: string;
  message: string;
  entry?: FinancialEntry;
  okButton?: ButtonConfig;
  cancelButton?: ButtonConfig;
}

export const useDialogs = () => {
  const $q = useQuasar();

  const defaultButtons = {
    confirmation: {
      ok: {
        label: 'Confirmar',
        color: 'negative',
        noCaps: true,
      },
      cancel: {
        label: 'Cancelar',
        color: 'primary',
        noCaps: true,
      },
    },
    info: {
      ok: { label: 'OK', color: 'primary', noCaps: true },
      cancel: null,
    },
    warning: {
      ok: { label: 'Entendido', color: 'warning', noCaps: true },
      cancel: null,
    },
  };

  const showDialog = (config: DialogConfig) => {
    const baseConfig = {
      title: config.title,
      message: config.message,
      html: true,
      persistent: true,
      ok: config.okButton || defaultButtons[config.type]?.ok || { label: 'OK', color: 'primary' },
      cancel: config.cancelButton || defaultButtons[config.type]?.cancel || undefined,
    };

    if (config.entry) {
      baseConfig.message += `
        <div class="q-mt-md text-weight-bold ${useAmountColorClass(config.entry.amount)}">
          ${config.entry.name} : ${useCurrencify(config.entry.amount)}
        </div>
      `;
    }

    return $q.dialog(baseConfig);
  };

  return { showDialog };
};
