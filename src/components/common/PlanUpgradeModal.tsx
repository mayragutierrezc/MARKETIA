import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Check, Sparkles, Zap, Shield, CreditCard, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlanType } from '../../types';

export const PlanUpgradeModal: React.FC = () => {
  const {
    upgradePlanModalOpen,
    setUpgradePlanModalOpen,
    subscription,
    pricingConfig,
    initiateCheckout
  } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [selectedPlanForGateway, setSelectedPlanForGateway] = useState<PlanType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    pricingConfig.plans.free,
    pricingConfig.plans.starter,
    pricingConfig.plans.pro
  ];

  const handleCheckout = async (gateway: 'stripe' | 'mercadopago', planId: PlanType) => {
    setIsProcessing(true);
    try {
      await initiateCheckout(gateway, planId, billingCycle);
    } finally {
      setIsProcessing(false);
      setSelectedPlanForGateway(null);
    }
  };

  return (
    <Modal
      isOpen={upgradePlanModalOpen}
      onClose={() => {
        setUpgradePlanModalOpen(false);
        setSelectedPlanForGateway(null);
      }}
      title="Elegí el plan para potenciar tu marketing"
      subtitle="Accedé a más generaciones con IA, calendario ilimitado y copiloto de marketing"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Usage bar */}
        <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#171717]">
                Uso de IA: {subscription.generationsUsed} de {subscription.generationsLimit === Infinity ? 'Ilimitadas' : subscription.generationsLimit} generaciones
              </p>
              <p className="text-xs text-[#737373]">
                Plan actual: <span className="font-bold uppercase text-[#6C5CE7]">{subscription.plan}</span> &bull; Se renueva el {subscription.renewalDate}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-36 h-2 bg-[#EAE7DF] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6C5CE7] rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  (subscription.generationsUsed / (subscription.generationsLimit === Infinity ? 100 : subscription.generationsLimit || 1)) * 100
                )}%`
              }}
            />
          </div>
        </div>

        {/* Currency & Billing cycle toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="p-1 bg-[#EFECE6] rounded-xl inline-flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currency === 'USD' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#737373]'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('ARS')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currency === 'ARS' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#737373]'
              }`}
            >
              Pesos Argentinos (ARS)
            </button>
          </div>

          <div className="p-1 bg-[#EFECE6] rounded-xl inline-flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#737373]'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'annual' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#737373]'
              }`}
            >
              Anual <span className="text-[10px] px-1.5 py-0.2 bg-[#22C55E]/15 text-[#15803D] rounded-full">20% OFF</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => {
            const isCurrent = subscription.plan === p.id;
            const discountFactor = billingCycle === 'annual' ? 0.8 : 1;
            const displayPriceUSD = p.priceUSD === 0 ? '$0' : `$${(p.priceUSD * discountFactor).toFixed(p.priceUSD % 1 === 0 ? 0 : 2)}`;
            const displayPriceARS = p.priceARS === 0 ? '$0' : `$${Math.round(p.priceARS * discountFactor).toLocaleString('es-AR')}`;

            return (
              <div
                key={p.id}
                className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                  p.popular
                    ? 'border-[#6C5CE7] bg-white shadow-md relative ring-2 ring-[#6C5CE7]/15'
                    : 'border-[#EAE7DF] bg-[#FAF9F6]'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#6C5CE7] text-white text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" /> Recomendado
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-lg text-[#171717]">{p.name}</h4>
                    {isCurrent && (
                      <span className="text-[11px] px-2 py-0.5 bg-[#EAE8E1] text-[#737373] font-semibold rounded-md">
                        Actual
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#737373] mt-1 min-h-[32px]">{p.tagline}</p>

                  <div className="mt-4 mb-5">
                    <span className="text-3xl font-extrabold text-[#171717]">
                      {currency === 'USD' ? displayPriceUSD : displayPriceARS}
                    </span>
                    <span className="text-xs text-[#737373] ml-1.5">
                      {p.priceUSD === 0 ? 'por siempre' : currency === 'USD' ? 'USD / mes' : 'ARS / mes'}
                    </span>
                    {currency === 'USD' && p.priceARS > 0 && (
                      <p className="text-[10px] text-[#737373] mt-0.5">
                        ≈ ${Math.round(p.priceARS * discountFactor).toLocaleString()} ARS
                      </p>
                    )}
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-[#EAE7DF]">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#4A4A4A]">
                        <Check className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-2 space-y-2">
                  {selectedPlanForGateway === p.id && !isCurrent ? (
                    <div className="space-y-2 p-3 rounded-xl bg-[#F8F7F4] border border-[#E5E5E1]">
                      <p className="text-[11px] font-bold text-[#171717] text-center">Seleccioná tu método de pago:</p>
                      <button
                        onClick={() => handleCheckout('mercadopago', p.id)}
                        disabled={isProcessing}
                        className="w-full py-2 px-3 rounded-lg bg-[#009EE3] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#0086c2] transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Pagar con Mercado Pago (ARS)</span>
                      </button>
                      <button
                        onClick={() => handleCheckout('stripe', p.id)}
                        disabled={isProcessing}
                        className="w-full py-2 px-3 rounded-lg bg-[#635BFF] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#5249e0] transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Pagar con Tarjeta / Stripe (USD)</span>
                      </button>
                      <button
                        onClick={() => setSelectedPlanForGateway(null)}
                        className="w-full text-center text-[10px] text-[#737373] hover:underline"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant={p.popular ? 'primary' : isCurrent ? 'outline' : 'soft'}
                      size="sm"
                      className="w-full"
                      disabled={isCurrent}
                      onClick={() => {
                        if (p.id === 'free') {
                          handleCheckout('stripe', 'free');
                        } else {
                          setSelectedPlanForGateway(p.id);
                        }
                      }}
                    >
                      {isCurrent ? 'Tu plan actual' : p.id === 'free' ? 'Volver a Free' : `Elegir ${p.name}`}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#737373] pt-2">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#22C55E]" /> Cancelá en cualquier momento sin costo
          </span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-[#6C5CE7]" /> Pagos protegidos por Stripe y Mercado Pago
          </span>
        </div>
      </div>
    </Modal>
  );
};
