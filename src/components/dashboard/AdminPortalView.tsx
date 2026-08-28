import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  CreditCard,
  TrendingUp,
  Settings2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Sliders,
  ShieldCheck,
  Zap,
  Save,
  ExternalLink,
  Copy,
  Check,
  Key,
  HelpCircle,
  Lock,
  Play
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import { PricingPlan, AdminCustomer, PlanType } from '../../types';

export const AdminPortalView: React.FC = () => {
  const {
    pricingConfig,
    updatePricingPlan,
    updateExchangeRate,
    customers,
    updateCustomerPlan,
    addCustomer,
    deleteCustomer,
    initiateCheckout,
    refreshAdminCustomers,
    addToast
  } = useApp();

  const [activeAdminSection, setActiveAdminSection] = useState<'customers' | 'pricing' | 'gateways'>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isRefreshingUsers, setIsRefreshingUsers] = useState(false);

  const handleRefreshUsers = async () => {
    setIsRefreshingUsers(true);
    try {
      await refreshAdminCustomers();
      addToast({
        type: 'success',
        title: 'Clientes sincronizados',
        message: 'Base de usuarios de Firestore actualizada en vivo.'
      });
    } catch {
      addToast({
        type: 'info',
        title: 'Sincronización completada'
      });
    } finally {
      setIsRefreshingUsers(false);
    }
  };

  // Gateway status state
  const [gatewayStatus, setGatewayStatus] = useState<{
    mercadopago?: { configured: boolean; isProduction: boolean; isSandbox: boolean; maskedToken: string | null };
    stripe?: { configured: boolean; isLive: boolean; maskedKey: string | null };
  }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/gateway-status')
      .then((res) => res.json())
      .then((data) => setGatewayStatus(data))
      .catch((err) => console.warn('Could not fetch gateway status:', err));
  }, [activeAdminSection]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
    addToast({
      type: 'info',
      title: 'Copiado al portapapeles',
      message: text
    });
  };

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    businessName: '',
    category: 'Gastronomía / Cafetería',
    plan: 'starter' as PlanType,
    paymentMethod: 'mercadopago' as 'stripe' | 'mercadopago' | 'free'
  });

  // Local state for pricing editing
  const [editingPricing, setEditingPricing] = useState(pricingConfig);
  const [rateInput, setRateInput] = useState(pricingConfig.arsExchangeRate.toString());

  // Filter Customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || c.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  // Compute Live Metrics
  const totalMRR_USD = customers.reduce((acc, c) => acc + (c.status === 'active' ? c.monthlyRevenueUSD : 0), 0);
  const totalMRR_ARS = customers.reduce((acc, c) => acc + (c.status === 'active' ? c.monthlyRevenueARS : 0), 0);
  const activeClientsCount = customers.filter((c) => c.status === 'active').length;
  const payingClientsCount = customers.filter((c) => c.plan !== 'free' && c.status === 'active').length;

  const handleSavePricing = () => {
    const rate = parseFloat(rateInput) || 1500;
    updateExchangeRate(rate);
    updatePricingPlan('free', editingPricing.plans.free);
    updatePricingPlan('starter', editingPricing.plans.starter);
    updatePricingPlan('pro', editingPricing.plans.pro);
    addToast({
      type: 'success',
      title: 'Precios actualizados en vivo',
      message: 'Los nuevos precios de MARKETIA ya rigen para landing y pasarelas.'
    });
  };

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email || !newCustomer.businessName) {
      addToast({
        type: 'warning',
        title: 'Completá los campos obligatorios'
      });
      return;
    }

    const planData = pricingConfig.plans[newCustomer.plan];
    const customerToAdd: AdminCustomer = {
      id: 'cust-' + Date.now(),
      name: newCustomer.name,
      email: newCustomer.email,
      businessName: newCustomer.businessName,
      category: newCustomer.category,
      plan: newCustomer.plan,
      paymentMethod: newCustomer.paymentMethod,
      status: 'active',
      monthlyRevenueUSD: planData.priceUSD,
      monthlyRevenueARS: planData.priceARS,
      generationsUsed: 0,
      signupDate: 'Hoy',
      lastActive: 'Recién registrado',
      autoRenew: true
    };

    addCustomer(customerToAdd);
    setIsAddCustomerModalOpen(false);
    setNewCustomer({
      name: '',
      email: '',
      businessName: '',
      category: 'Gastronomía / Cafetería',
      plan: 'starter',
      paymentMethod: 'mercadopago'
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#6C5CE7]/15 text-[#6C5CE7] font-extrabold text-[10px] uppercase tracking-wider">
              Control Center
            </span>
            <h2 className="text-2xl font-bold text-[#171717]">Panel Administrador de Negocio</h2>
          </div>
          <p className="text-xs text-[#737373] mt-1">
            Gestioná las cuentas de clientes, modificá precios en vivo y configurá Stripe y Mercado Pago.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="p-1 bg-[#EAE7DF] rounded-xl inline-flex items-center gap-1 text-xs font-semibold self-start">
          <button
            onClick={() => setActiveAdminSection('customers')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeAdminSection === 'customers' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#737373]'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Clientes ({customers.length})
          </button>
          <button
            onClick={() => setActiveAdminSection('pricing')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeAdminSection === 'pricing' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#737373]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Modificar Precios
          </button>
          <button
            onClick={() => setActiveAdminSection('gateways')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeAdminSection === 'gateways' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#737373]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Pasarelas de Pago
          </button>
        </div>
      </div>

      {/* KPI Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-[#E5E5E1] space-y-1">
          <div className="flex items-center justify-between text-[#737373]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Facturación Mensual (USD)</span>
            <DollarSign className="w-4 h-4 text-[#22C55E]" />
          </div>
          <p className="text-2xl font-black text-[#171717]">
            ${totalMRR_USD.toLocaleString('en-US', { minimumFractionDigits: 1 })} <span className="text-xs font-normal text-[#737373]">USD/mes</span>
          </p>
          <p className="text-[10px] text-[#22C55E] font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +24% vs mes anterior
          </p>
        </Card>

        <Card className="p-4 bg-white border border-[#E5E5E1] space-y-1">
          <div className="flex items-center justify-between text-[#737373]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Facturación Local (ARS)</span>
            <span className="text-xs font-bold text-[#6C5CE7]">$ ARS</span>
          </div>
          <p className="text-2xl font-black text-[#171717]">
            ${totalMRR_ARS.toLocaleString('es-AR')} <span className="text-xs font-normal text-[#737373]">ARS/mes</span>
          </p>
          <p className="text-[10px] text-[#737373]">Tasa oficial: $1 USD = ${pricingConfig.arsExchangeRate} ARS</p>
        </Card>

        <Card className="p-4 bg-white border border-[#E5E5E1] space-y-1">
          <div className="flex items-center justify-between text-[#737373]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Clientes Activos</span>
            <Users className="w-4 h-4 text-[#6C5CE7]" />
          </div>
          <p className="text-2xl font-black text-[#171717]">{activeClientsCount}</p>
          <p className="text-[10px] text-[#737373]">{payingClientsCount} clientes de pago / {customers.length - payingClientsCount} en prueba</p>
        </Card>

        <Card className="p-4 bg-white border border-[#E5E5E1] space-y-1">
          <div className="flex items-center justify-between text-[#737373]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Generaciones IA Totales</span>
            <Sparkles className="w-4 h-4 text-[#F59EBD]" />
          </div>
          <p className="text-2xl font-black text-[#171717]">
            {customers.reduce((acc, c) => acc + c.generationsUsed, 0)}
          </p>
          <p className="text-[10px] text-[#22C55E]">Costo promedio IA por cliente: &lt; $0.15 USD</p>
        </Card>
      </div>

      {/* SECTION 1: CUSTOMERS MANAGEMENT */}
      {activeAdminSection === 'customers' && (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E5E1]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, email o negocio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-[#F8F7F4] border border-[#E5E5E1] rounded-xl text-xs text-[#171717] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#6C5CE7] w-64 sm:w-80"
                />
              </div>

              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="py-1.5 px-3 bg-[#F8F7F4] border border-[#E5E5E1] rounded-xl text-xs text-[#171717] focus:outline-none"
              >
                <option value="all">Todos los planes</option>
                <option value="free">Solo Free</option>
                <option value="starter">Solo Starter</option>
                <option value="pro">Solo PRO</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshUsers}
                disabled={isRefreshingUsers}
                leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshingUsers ? 'animate-spin' : ''}`} />}
              >
                {isRefreshingUsers ? 'Sincronizando...' : 'Sincronizar Firestore'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddCustomerModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Nuevo Cliente
              </Button>
            </div>
          </div>

          {/* Customers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F7F4] text-[#737373] uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Cliente / Negocio</th>
                  <th className="py-3 px-4">Plan Actual</th>
                  <th className="py-3 px-4">Pasarela</th>
                  <th className="py-3 px-4">Facturación</th>
                  <th className="py-3 px-4">Uso IA</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E1]">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8F7F4]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-[#171717] text-sm block">{c.businessName}</span>
                        <span className="text-[#737373] text-[11px]">{c.name} &bull; {c.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={c.plan}
                        onChange={(e) => updateCustomerPlan(c.id, e.target.value as PlanType)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer border ${
                          c.plan === 'pro'
                            ? 'bg-[#6C5CE7]/10 text-[#6C5CE7] border-[#6C5CE7]/30'
                            : c.plan === 'starter'
                            ? 'bg-[#22C55E]/10 text-[#15803D] border-[#22C55E]/30'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        <option value="free">FREE ($0)</option>
                        <option value="starter">STARTER (${pricingConfig.plans.starter.priceUSD})</option>
                        <option value="pro">PRO (${pricingConfig.plans.pro.priceUSD})</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      {c.paymentMethod === 'mercadopago' ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#009EE3]/10 text-[#009EE3] font-bold text-[10px]">
                          Mercado Pago
                        </span>
                      ) : c.paymentMethod === 'stripe' ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#635BFF]/10 text-[#635BFF] font-bold text-[10px]">
                          Stripe USD
                        </span>
                      ) : (
                        <span className="text-[#737373] text-[11px]">Sin pasarela</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#171717]">
                        ${c.monthlyRevenueUSD} USD
                      </div>
                      <div className="text-[10px] text-[#737373]">
                        (${c.monthlyRevenueARS.toLocaleString()} ARS)
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#171717]">{c.generationsUsed}</span>
                      <span className="text-[10px] text-[#737373]"> gens</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        c.status === 'active'
                          ? 'bg-[#22C55E]/15 text-[#15803D]'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {c.status === 'active' ? 'Activo' : 'Prueba'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar cliente ${c.businessName}?`)) {
                            deleteCustomer(c.id);
                          }
                        }}
                        className="text-[#EF4444] hover:text-red-700 text-xs font-medium cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* SECTION 2: EDIT PRICING & EXCHANGE RATE */}
      {activeAdminSection === 'pricing' && (
        <Card className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E1]">
            <div>
              <h3 className="text-base font-bold text-[#171717]">Editor de Precios y Moneda en Vivo</h3>
              <p className="text-xs text-[#737373] mt-0.5">
                Cualquier cambio se reflejará al instante en la Landing Page, modal de suscripción y botones de checkout.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#F8F7F4] px-3 py-1.5 rounded-xl border border-[#E5E5E1] text-xs">
                <span className="text-[#737373] font-medium">1 USD =</span>
                <input
                  type="number"
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  className="w-20 font-bold text-[#171717] bg-white px-2 py-0.5 rounded border border-[#E5E5E1] text-center"
                />
                <span className="text-[#737373] font-medium">ARS</span>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSavePricing}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Guardar Precios
              </Button>
            </div>
          </div>

          {/* Pricing Plans Grid Config */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* FREE PLAN */}
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#171717]">Plan FREE</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-bold uppercase">Base</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#737373] uppercase">Precio USD</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-[#737373]">$</span>
                  <input
                    type="number"
                    disabled
                    value={0}
                    className="w-full font-bold text-lg bg-gray-100 px-3 py-1.5 rounded-xl border border-[#E5E5E1]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#737373] uppercase">Límite Generaciones IA / Mes</label>
                <input
                  type="number"
                  value={editingPricing.plans.free.generationsLimit}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setEditingPricing((prev) => ({
                      ...prev,
                      plans: {
                        ...prev.plans,
                        free: { ...prev.plans.free, generationsLimit: val }
                      }
                    }));
                  }}
                  className="w-full mt-1 font-semibold text-sm bg-white px-3 py-1.5 rounded-xl border border-[#E5E5E1]"
                />
              </div>
            </div>

            {/* STARTER PLAN */}
            <div className="p-5 rounded-2xl bg-white border-2 border-[#22C55E]/40 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#171717]">Plan STARTER</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#22C55E]/15 text-[#15803D] font-bold uppercase">Popular</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#737373] uppercase">Precio USD / mes</label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-bold text-[#737373]">$</span>
                    <input
                      type="number"
                      step="0.5"
                      value={editingPricing.plans.starter.priceUSD}
                      onChange={(e) => {
                        const usd = parseFloat(e.target.value) || 0;
                        const rate = parseFloat(rateInput) || 1500;
                        setEditingPricing((prev) => ({
                          ...prev,
                          plans: {
                            ...prev.plans,
                            starter: {
                              ...prev.plans.starter,
                              priceUSD: usd,
                              priceARS: Math.round(usd * rate)
                            }
                          }
                        }));
                      }}
                      className="w-full font-bold text-base bg-[#F8F7F4] px-2 py-1 rounded-xl border border-[#E5E5E1]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#737373] uppercase">Precio ARS / mes</label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-bold text-[#737373]">$</span>
                    <input
                      type="number"
                      value={editingPricing.plans.starter.priceARS}
                      onChange={(e) => {
                        const ars = parseInt(e.target.value) || 0;
                        setEditingPricing((prev) => ({
                          ...prev,
                          plans: {
                            ...prev.plans,
                            starter: { ...prev.plans.starter, priceARS: ars }
                          }
                        }));
                      }}
                      className="w-full font-bold text-base bg-[#F8F7F4] px-2 py-1 rounded-xl border border-[#E5E5E1]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#737373] uppercase">Límite Generaciones IA / Mes</label>
                <input
                  type="number"
                  value={editingPricing.plans.starter.generationsLimit}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setEditingPricing((prev) => ({
                      ...prev,
                      plans: {
                        ...prev.plans,
                        starter: { ...prev.plans.starter, generationsLimit: val }
                      }
                    }));
                  }}
                  className="w-full mt-1 font-semibold text-sm bg-[#F8F7F4] px-3 py-1.5 rounded-xl border border-[#E5E5E1]"
                />
              </div>
            </div>

            {/* PRO PLAN */}
            <div className="p-5 rounded-2xl bg-white border-2 border-[#6C5CE7] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#171717]">Plan PRO</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#6C5CE7]/15 text-[#6C5CE7] font-bold uppercase">Ilimitado</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#737373] uppercase">Precio USD / mes</label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-bold text-[#737373]">$</span>
                    <input
                      type="number"
                      step="0.5"
                      value={editingPricing.plans.pro.priceUSD}
                      onChange={(e) => {
                        const usd = parseFloat(e.target.value) || 0;
                        const rate = parseFloat(rateInput) || 1500;
                        setEditingPricing((prev) => ({
                          ...prev,
                          plans: {
                            ...prev.plans,
                            pro: {
                              ...prev.plans.pro,
                              priceUSD: usd,
                              priceARS: Math.round(usd * rate)
                            }
                          }
                        }));
                      }}
                      className="w-full font-bold text-base bg-[#F8F7F4] px-2 py-1 rounded-xl border border-[#E5E5E1]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#737373] uppercase">Precio ARS / mes</label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-bold text-[#737373]">$</span>
                    <input
                      type="number"
                      value={editingPricing.plans.pro.priceARS}
                      onChange={(e) => {
                        const ars = parseInt(e.target.value) || 0;
                        setEditingPricing((prev) => ({
                          ...prev,
                          plans: {
                            ...prev.plans,
                            pro: { ...prev.plans.pro, priceARS: ars }
                          }
                        }));
                      }}
                      className="w-full font-bold text-base bg-[#F8F7F4] px-2 py-1 rounded-xl border border-[#E5E5E1]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#737373] uppercase">Generaciones IA</label>
                <div className="p-2 rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7] font-bold text-xs flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Ilimitadas (PRO)
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* SECTION 3: GATEWAYS CONFIGURATION */}
      {activeAdminSection === 'gateways' && (
        <div className="space-y-6">
          {/* Top Banner with Quick Actions */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#009EE3]/10 via-[#009EE3]/5 to-transparent border border-[#009EE3]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#009EE3] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                MP
              </div>
              <div>
                <h3 className="font-bold text-base text-[#171717]">Configuración de Mercado Pago para Cobros en Pesos</h3>
                <p className="text-xs text-[#525252] mt-0.5 max-w-2xl">
                  Permite a tus clientes pagar tus planes mensuales y anuales con Tarjeta de Débito, Crédito, Dinero en Cuenta o Transferencia en pesos argentinos.
                </p>
              </div>
            </div>
            <a
              href="https://www.mercadopago.com/developers/panel/app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#009EE3] hover:bg-[#0089C7] text-white text-xs font-bold rounded-xl transition-all shadow-xs self-start md:self-auto cursor-pointer"
            >
              <span>Panel Mercado Pago Devs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MERCADO PAGO CARD */}
            <Card className="space-y-5 border-2 border-[#009EE3]/30">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E1]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#009EE3]/15 text-[#009EE3] flex items-center justify-center font-black text-xs">
                    MP
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#171717]">Mercado Pago Checkout Pro</h4>
                    <p className="text-[11px] text-[#737373]">Cobros en ARS con acreditación inmediata</p>
                  </div>
                </div>

                {gatewayStatus.mercadopago?.configured ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                    <CheckCircle2 className="w-3 h-3" /> Token Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                    <Clock className="w-3 h-3" /> Modo Simulado / Pendiente
                  </span>
                )}
              </div>

              {/* Step by step connection guide */}
              <div className="space-y-3 text-xs">
                <h5 className="font-bold text-[#171717] flex items-center gap-1.5 text-xs">
                  <Key className="w-3.5 h-3.5 text-[#009EE3]" />
                  Pasos para conectar tu cuenta real:
                </h5>

                <div className="space-y-2.5">
                  <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#E5E5E1] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#171717]">1. Creá tu aplicación en Mercado Pago</span>
                      <a
                        href="https://www.mercadopago.com/developers/panel/app"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#009EE3] font-semibold text-[11px] hover:underline flex items-center gap-0.5"
                      >
                        Ir al panel <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[11px] text-[#737373]">
                      Iniciá sesión en Mercado Pago Developers, hacé clic en <strong>Crear tu aplicación</strong> y elegí <strong>Checkout Pro</strong>.
                    </p>
                  </div>

                  <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#E5E5E1] space-y-1.5">
                    <span className="font-bold text-[#171717]">2. Copiá tu Production Access Token</span>
                    <p className="text-[11px] text-[#737373]">
                      En el menú lateral de tu app en Mercado Pago, entrá a <strong>Credenciales de producción</strong> y copiá el <strong>Access Token</strong> (comienza con <code className="bg-white px-1 py-0.5 rounded border border-[#E5E5E1] text-[10px]">APP_USR-...</code>).
                    </p>
                  </div>

                  <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#E5E5E1] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#171717]">3. Nombre de la variable de entorno</span>
                      <button
                        onClick={() => copyToClipboard('MERCADOPAGO_ACCESS_TOKEN', 'mp_env')}
                        className="text-[11px] text-[#6C5CE7] hover:text-[#5846E0] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'mp_env' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copiar nombre</span>
                      </button>
                    </div>
                    <code className="block bg-white p-2 rounded-lg border border-[#E5E5E1] text-[11px] text-[#171717] font-mono select-all">
                      MERCADOPAGO_ACCESS_TOKEN
                    </code>
                    <p className="text-[11px] text-[#737373]">
                      Pegá el token en los Secretos / Configuración de la aplicación bajo esa variable.
                    </p>
                  </div>
                </div>

                {/* Test Checkout Button */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center text-xs border-[#009EE3] text-[#009EE3] hover:bg-[#009EE3]/5"
                    leftIcon={<Play className="w-3.5 h-3.5" />}
                    onClick={() => initiateCheckout('mercadopago', 'starter', 'monthly')}
                  >
                    Probar Checkout de Mercado Pago Ahora
                  </Button>
                </div>
              </div>
            </Card>

            {/* STRIPE CARD */}
            <Card className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E1]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#635BFF]/15 text-[#635BFF] flex items-center justify-center font-black text-xs">
                    S
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#171717]">Stripe Checkout (USD)</h4>
                    <p className="text-[11px] text-[#737373]">Cobros internacionales con tarjeta en dólares</p>
                  </div>
                </div>

                {gatewayStatus.stripe?.configured ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                    <CheckCircle2 className="w-3 h-3" /> Clave Activa
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                    <Clock className="w-3 h-3" /> Simulación Activa
                  </span>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <h5 className="font-bold text-[#171717] flex items-center gap-1.5 text-xs">
                  <Key className="w-3.5 h-3.5 text-[#635BFF]" />
                  Pasos para conectar Stripe:
                </h5>

                <div className="space-y-2.5">
                  <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#E5E5E1] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#171717]">1. Dashboard de Stripe</span>
                      <a
                        href="https://dashboard.stripe.com/apikeys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#635BFF] font-semibold text-[11px] hover:underline flex items-center gap-0.5"
                      >
                        Ir a API Keys <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[11px] text-[#737373]">
                      Iniciá sesión en Stripe y copiá tu <strong>Secret key</strong> (<code className="bg-white px-1 py-0.5 rounded border border-[#E5E5E1] text-[10px]">sk_live_...</code>).
                    </p>
                  </div>

                  <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#E5E5E1] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#171717]">2. Variable de entorno</span>
                      <button
                        onClick={() => copyToClipboard('STRIPE_SECRET_KEY', 'stripe_env')}
                        className="text-[11px] text-[#6C5CE7] hover:text-[#5846E0] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'stripe_env' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copiar nombre</span>
                      </button>
                    </div>
                    <code className="block bg-white p-2 rounded-lg border border-[#E5E5E1] text-[11px] text-[#171717] font-mono select-all">
                      STRIPE_SECRET_KEY
                    </code>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center text-xs border-[#635BFF] text-[#635BFF] hover:bg-[#635BFF]/5"
                    leftIcon={<Play className="w-3.5 h-3.5" />}
                    onClick={() => initiateCheckout('stripe', 'starter', 'monthly')}
                  >
                    Probar Checkout de Stripe en USD
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOMER MANUALLY */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-[#E5E5E1] shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E1]">
              <h3 className="font-bold text-lg text-[#171717]">Alta de Nuevo Cliente</h3>
              <button
                onClick={() => setIsAddCustomerModalOpen(false)}
                className="text-[#737373] hover:text-[#171717] font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#171717]">Nombre del Dueño/a *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Méndez"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-[#E5E5E1] bg-[#F8F7F4]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171717]">Email del Cliente *</label>
                <input
                  type="email"
                  required
                  placeholder="laura@tunegocio.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-[#E5E5E1] bg-[#F8F7F4]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171717]">Nombre del Negocio / Marca *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Aura Spa Urbano"
                  value={newCustomer.businessName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, businessName: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-[#E5E5E1] bg-[#F8F7F4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#171717]">Plan</label>
                  <select
                    value={newCustomer.plan}
                    onChange={(e) => setNewCustomer({ ...newCustomer, plan: e.target.value as PlanType })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E5E5E1] bg-[#F8F7F4]"
                  >
                    <option value="free">FREE ($0)</option>
                    <option value="starter">STARTER (${pricingConfig.plans.starter.priceUSD})</option>
                    <option value="pro">PRO (${pricingConfig.plans.pro.priceUSD})</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#171717]">Método de Pago</label>
                  <select
                    value={newCustomer.paymentMethod}
                    onChange={(e) => setNewCustomer({ ...newCustomer, paymentMethod: e.target.value as any })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E5E5E1] bg-[#F8F7F4]"
                  >
                    <option value="mercadopago">Mercado Pago</option>
                    <option value="stripe">Stripe USD</option>
                    <option value="free">Free / Bonificado</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddCustomerModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Guardar Cliente
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
