'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import {
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MockProduct,
  MockSaleOrder,
} from '@/lib/mock-data';
import {
  ShoppingBag,
  Building2,
  HardHat,
  Award,
  Truck,
  CheckCircle2,
  Plus,
  ShieldCheck,
  FileCheck,
  Boxes,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function PWDMarketplacePage() {
  const [products] = React.useState<MockProduct[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = React.useState<MockSaleOrder[]>(MOCK_ORDERS);
  const [selectedProduct, setSelectedProduct] = React.useState<MockProduct | null>(null);
  const [orderModalOpen, setOrderModalOpen] = React.useState(false);

  // Order form state
  const [buyerName, setBuyerName] = React.useState('Kadambathur Gram Panchayat');
  const [buyerType, setBuyerType] = React.useState<'GRAM_PANCHAYAT' | 'PWD' | 'CONTRACTOR'>('GRAM_PANCHAYAT');
  const [orderQuantity, setOrderQuantity] = React.useState('2000');
  const [deliveryAddress, setDeliveryAddress] = React.useState('Panchayat Main Road Project, Site #3');
  const [notes, setNotes] = React.useState('Funded via 15th FC tied grant for plastic-free rural roads');

  const totalDeliveredRevenue = orders
    .filter(o => o.status === 'DELIVERED')
    .reduce((s, o) => s + o.totalAmountINR, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const qty = Number(orderQuantity) || 100;
    const totalINR = qty * selectedProduct.unitPriceINR;

    const newOrder: MockSaleOrder = {
      id: `ORD-${Date.now()}`,
      orderCode: `PO-GP-2026-0${orders.length + 20}`,
      buyerName,
      buyerType,
      deliveryAddress,
      items: [
        {
          productName: selectedProduct.name,
          quantity: qty,
          unitPriceINR: selectedProduct.unitPriceINR,
          totalINR,
        },
      ],
      totalAmountINR: totalINR,
      status: 'PENDING',
      orderDate: 'Just now',
      notes,
    };

    setOrders([newOrder, ...orders]);
    setOrderModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Forward Linkage & PWD Marketplace',
        subtitle: 'Institutional Procurement Portal for Certified Upcycled Rural Infrastructure Products',
      }}
    >
      <div className="space-y-6">
        {/* KPI Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Available Products"
            value={products.length.toString()}
            subtext="Certified IS / IRC compliant"
            icon={<Boxes className="w-5 h-5 text-emerald-700" />}
          />
          <StatCard
            title="Total Procurement Value"
            value={`₹${(totalDeliveredRevenue + 120100).toLocaleString()}`}
            subtext="From PWD, GPs & Contractors"
            icon={<Building2 className="w-5 h-5 text-blue-700" />}
          />
          <StatCard
            title="Plastic Diverted into Infra"
            value="18.4 MT"
            subtext="Locked into permanent structures"
            icon={<ShieldCheck className="w-5 h-5 text-teal-700" />}
          />
          <StatCard
            title="Active Purchase Orders"
            value={orders.length.toString()}
            subtext={`${orders.filter(o => o.status === 'PENDING').length} awaiting PWMU dispatch`}
            icon={<Truck className="w-5 h-5 text-amber-700" />}
          />
        </div>

        {/* PWD Mandate Banner */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-900 to-emerald-950 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  MoRTH &amp; SBM-G Guideline Compliance
                </div>
                <h3 className="text-xl font-bold">100% Guaranteed Forward Offtake for Rural PWMUs</h3>
                <p className="text-slate-300 text-sm max-w-2xl">
                  Enabling Gram Panchayats to procure paver blocks and fencing posts directly under 15th Finance Commission rural development grants, while Public Works Departments (PWD) procure IRC:SP:98 plastic modifier for asphalt roads.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Catalog Cards */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-foreground">Certified Upcycled Product Catalog</h3>
            <p className="text-xs text-muted-foreground">Each product carries digital batch-level batch certificate with QR traceability.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <Card key={p.id} className="border border-border hover:shadow-md transition-shadow flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px] uppercase font-mono font-bold text-emerald-700 border-emerald-300">
                      {p.productType.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      In Stock: {p.availableStock.toLocaleString()}
                    </span>
                  </div>
                  <CardTitle className="text-sm font-bold leading-snug">{p.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.specification}</p>

                  <div className="p-2.5 bg-muted/40 rounded-lg text-xs space-y-1 font-mono">
                    <div className="text-[11px] text-muted-foreground">Std: <strong className="text-foreground">{p.standardCompliance}</strong></div>
                    <div className="text-[11px] text-emerald-700">Spec: <strong>{p.testedStrength}</strong></div>
                    <div className="text-[11px] text-blue-700">MLP Content: <strong>{p.mlpContentKgPerUnit} kg / {p.unit}</strong></div>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-border">
                    <div>
                      <span className="text-xs text-muted-foreground">Unit Price</span>
                      <div className="text-xl font-extrabold text-foreground font-mono">
                        ₹{p.unitPriceINR.toFixed(2)}
                        <span className="text-xs text-muted-foreground font-normal"> / {p.unit}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(p);
                        setOrderModalOpen(true);
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Requisition
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Institutional Purchase Orders Table */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <HardHat className="w-4 h-4 text-foreground" /> Institutional Purchase &amp; Work Orders
                </CardTitle>
                <CardDescription>
                  Government and contractor contracts fulfilled by rural PWMU processing centers.
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {orders.length} total orders
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Order Code &amp; Buyer</th>
                    <th className="py-3 px-4">Buyer Entity</th>
                    <th className="py-3 px-4">Items &amp; Quantities</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Delivery Site</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{o.orderCode}</div>
                        <div className="text-xs text-muted-foreground">{o.buyerName}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{o.orderDate}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={
                            o.buyerType === 'PWD'
                              ? 'border-blue-300 text-blue-800 bg-blue-50'
                              : o.buyerType === 'GRAM_PANCHAYAT'
                              ? 'border-emerald-300 text-emerald-800 bg-emerald-50'
                              : 'border-slate-300 text-slate-800 bg-slate-50'
                          }
                        >
                          {o.buyerType.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {o.items.map((it, idx) => (
                          <div key={idx} className="font-medium text-foreground">
                            {it.quantity.toLocaleString()} x {it.productName}
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-sm text-foreground">
                        ₹{o.totalAmountINR.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            o.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : o.status === 'DISPATCHED'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }
                        >
                          {o.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs truncate">
                        {o.deliveryAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal: Place Requisition */}
        {orderModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-700" /> Place Institutional Requisition Order
                </h3>
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-foreground">{selectedProduct.name}</div>
                  <div className="text-muted-foreground">Standard: {selectedProduct.standardCompliance}</div>
                  <div className="font-mono font-bold text-emerald-700 text-sm">
                    Unit Price: ₹{selectedProduct.unitPriceINR.toFixed(2)} per {selectedProduct.unit}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Requisitioning Entity</label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value as any)}
                    className="w-full text-sm rounded-lg border border-border bg-background p-2.5 focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="GRAM_PANCHAYAT">Gram Panchayat (15th FC / SBM-G Rural Works)</option>
                    <option value="PWD">Public Works Department (PWD / Rural Highways)</option>
                    <option value="CONTRACTOR">Empanelled Civil Infrastructure Contractor</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Buyer / Office Name</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full text-sm rounded-lg border border-border bg-background p-2 focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Quantity ({selectedProduct.unit}s)
                    </label>
                    <input
                      type="number"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(e.target.value)}
                      className="w-full text-sm rounded-lg border border-border bg-background p-2 focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Site Delivery Address</label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={2}
                    className="w-full text-sm rounded-lg border border-border bg-background p-2 focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Project Scheme / Funding Head</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-sm rounded-lg border border-border bg-background p-2 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg text-xs font-mono flex justify-between items-center text-emerald-900">
                  <span>Estimated Total Requisition:</span>
                  <span className="font-extrabold text-base">
                    ₹{((Number(orderQuantity) || 0) * selectedProduct.unitPriceINR).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setOrderModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold">
                    Submit Institutional Requisition
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
