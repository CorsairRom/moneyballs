import { boot } from 'quasar/wrappers';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from 'quasar';

export default boot(async () => {
  if (Platform.is.capacitor) {
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#33000000' });
      await StatusBar.show();
    } catch (err) {
      console.error('Status Bar Error:', err);
    }
  }
});
