import { useQuasar } from 'quasar';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationConfig {
  message: string;
  type?: NotificationType;
  timeout?: number;
  position?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left';
}

export const useNotifications = () => {
  const $q = useQuasar();

  const defaultConfig = {
    timeout: 3000,
    position: 'top-right' as const,
  };

  const typeConfig = {
    error: {
      color: 'negative',
      icon: 'error',
    },
    success: {
      color: 'positive',
      icon: 'check_circle',
    },
    warning: {
      color: 'warning',
      icon: 'warning',
    },
    info: {
      color: 'info',
      icon: 'info',
    },
  };

  const showNotification = (config: NotificationConfig) => {
    $q.notify({
      ...defaultConfig,
      ...typeConfig[config.type || 'info'],
      message: config.message,
      position: config.position || defaultConfig.position,
      timeout: config.timeout || defaultConfig.timeout,
    });
  };

  return { showNotification };
};
