import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Détecter le navigateur et l'OS
    const ua = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua);
    const isAndroidDevice = /Android/.test(ua);
    const isSafariBrowser = /Safari/.test(ua) && !/Chrome/.test(ua);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    setIsSafari(isSafariBrowser);

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Afficher le prompt après 2 secondes
    const timer = setTimeout(() => {
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowPrompt(false);
        }
      } catch (error) {
        console.log('Installation error:', error);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-md shadow-2xl">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Plus size={24} className="text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-black text-slate-900">Installer l'app</h2>
                <p className="text-xs text-slate-500">Accès rapide depuis votre écran d'accueil</p>
              </div>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all flex-shrink-0"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Instructions adaptées */}
          <div className="space-y-4 mb-6">
            {isIOS && isSafari ? (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Appuyez sur le bouton Partager</p>
                    <p className="text-xs text-slate-600">En bas de l'écran (icône carrée avec flèche)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Sélectionnez "Sur l'écran d'accueil"</p>
                    <p className="text-xs text-slate-600">Faites défiler si nécessaire</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Appuyez sur "Ajouter"</p>
                    <p className="text-xs text-slate-600">L'app s'ajoutera à votre écran d'accueil</p>
                  </div>
                </div>
              </div>
            ) : isAndroid ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Appuyez sur le menu (⋮)</p>
                    <p className="text-xs text-slate-600">En haut à droite du navigateur</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Sélectionnez "Installer l'app"</p>
                    <p className="text-xs text-slate-600">Ou "Ajouter à l'écran d'accueil"</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Confirmez l'installation</p>
                    <p className="text-xs text-slate-600">L'app s'installera automatiquement</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Appuyez sur le bouton d'installation</p>
                    <p className="text-xs text-slate-600">Ou utilisez le menu du navigateur</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Confirmez l'installation</p>
                    <p className="text-xs text-slate-600">L'app s'ajoutera à votre écran d'accueil</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowPrompt(false)}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Plus tard
            </button>
            {deferredPrompt && (
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} className="text-white" />
                <span>Installer</span>
              </button>
            )}
          </div>

          {/* Info */}
          <p className="text-xs text-slate-500 text-center mt-4">
            L'app fonctionnera hors ligne et se mettra à jour automatiquement
          </p>
        </div>
      </div>
    </div>
  );
};
