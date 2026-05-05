import { VehicleHelperService } from './vehicleHelperService';
import { getCorrectDirection } from '../../../../../../utils/prioriteIcons';
import { MAGIC_NUMBER } from '../utils/constants';

export class PopupContentService {
  static escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, (m) => {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  static createPremiumPopupContent(vehicle, address) {
    const direction = getCorrectDirection(vehicle.course);
    const ignition = vehicle.sensors?.find(s => s.type === 'acc');
    const odometer = vehicle.sensors?.find(s => s.type === 'odometer');
    const alarm = vehicle.sensors?.find(s => s.type === 'textual');
    const isMoving = vehicle.speed > MAGIC_NUMBER.MOVING_SPEED_THRESHOLD;
    const signalLost = VehicleHelperService.isSignalLost(vehicle);
    const displayAddress = VehicleHelperService.formatAddress(vehicle, address);
    const stopDisplay = !isMoving ? VehicleHelperService.formatStopDuration(vehicle) : null;
    
    return `
      <div class="premium-popup-content" style="min-width: 260px; max-width: 320px;">
        <div class="popup-premium-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px 16px; border-radius: 12px 12px 0 0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                ${isMoving ? '🚗' : '🅿️'}
              </div>
              <div>
                <div style="font-weight: bold; color: white; font-size: 14px;">${this.escapeHtml(vehicle.name)}</div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.8);">ID: ${vehicle.id}</div>
              </div>
            </div>
            <div style="background: ${signalLost ? '#dc2626' : isMoving ? '#52c41a' : '#faad14'}; padding: 4px 8px; border-radius: 20px; font-size: 10px; color: white; font-weight: bold;">
              ${signalLost ? '📡 SIGNAL PERDU' : isMoving ? 'EN MOUVEMENT' : (stopDisplay || 'À L\'ARRÊT')}
            </div>
          </div>
        </div>
        <div style="padding: 12px 16px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: #f5f5f5; padding: 8px; border-radius: 8px; text-align: center;">
              <div style="font-size: 10px; color: #8c8c8c;">Vitesse</div>
              <div style="font-size: 18px; font-weight: bold; color: ${isMoving ? '#1890ff' : '#8c8c8c'};">${vehicle.speed} <span style="font-size: 10px;">km/h</span></div>
            </div>
            <div style="background: #f5f5f5; padding: 8px; border-radius: 8px; text-align: center;">
              <div style="font-size: 10px; color: #8c8c8c;">Direction</div>
              <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                <span style="display: inline-block; transform: rotate(${direction.angle}deg); font-size: 14px;">⬆️</span>
                <span style="font-size: 14px; font-weight: bold;">${direction.label}</span>
              </div>
            </div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 11px; color: #8c8c8c;">📍 Adresse</span>
              <span style="font-size: 11px; text-align: right; max-width: 180px; word-break: break-word;">${this.escapeHtml(displayAddress)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 11px; color: #8c8c8c;">⚡ Contact</span>
              <span style="font-size: 11px; font-weight: bold; color: ${ignition?.val ? '#52c41a' : '#8c8c8c'}">${ignition?.value || 'OFF'}</span>
            </div>
            ${!isMoving && stopDisplay ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 11px; color: #8c8c8c;">⏱️ Stationnement</span>
                <span style="font-size: 11px; font-weight: bold; color: #faad14;">${stopDisplay.replace('🕐', '')}</span>
              </div>
            ` : ''}
            ${odometer ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 11px; color: #8c8c8c;">📊 Odomètre</span>
                <span style="font-size: 11px; font-weight: bold;">${this.escapeHtml(odometer.value)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 11px; color: #8c8c8c;">🕐 Dernière mise à jour</span>
              <span style="font-size: 10px;">${vehicle.time || '-'}</span>
            </div>
          </div>
          ${alarm?.value && alarm.value !== '-' ? `
            <div style="background: #fff1f0; border-left: 3px solid #ff4d4f; padding: 8px; border-radius: 8px; margin-top: 8px;">
              <span style="font-size: 11px; color: #ff4d4f;">⚠️ ${this.escapeHtml(alarm.value)}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}