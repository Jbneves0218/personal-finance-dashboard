import { useState, useEffect } from 'react'
import {
  Plus, Trash2, DollarSign, CreditCard, TrendingUp, WalletCards,
  ShoppingCart, Utensils, Zap, Droplets, Home, Car, Coins,
  CircleDollarSign, FileText, PieChart as PieChartIcon, BarChart2
} from 'lucide-react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

// Utilidade para gerar IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

const DEFAULT_INCOMES = [
  { id: 'inc_1', name: 'Salário Bruto', amount: '' }
]

const DEFAULT_EXPENSES = [
  { id: 'exp_1', name: 'Contas Obrigatórias', amount: '' },
  { id: 'exp_2', name: 'Alimentação', amount: '' },
  { id: 'exp_3', name: 'Compras', amount: '' },
  { id: 'exp_4', name: 'Investimento Mensal', amount: '' }
]

const COLORS = ['#79c0ff', '#d2a8ff', '#ffa657', '#3fb950', '#f85149', '#ff7b72', '#a5d6ff', '#e3b341']

// Função que define ícones inteligentes
const getIconForCategory = (name) => {
  const n = name.toLowerCase()
  if (n.includes('alimentação') || n.includes('comida') || n.includes('ifood') || n.includes('restaurante')) return <Utensils size={18} />
  if (n.includes('compra') || n.includes('mercado') || n.includes('loja')) return <ShoppingCart size={18} />
  if (n.includes('luz') || n.includes('energia')) return <Zap size={18} />
  if (n.includes('água') || n.includes('agua')) return <Droplets size={18} />
  if (n.includes('aluguel') || n.includes('casa') || n.includes('moradia')) return <Home size={18} />
  if (n.includes('carro') || n.includes('transporte') || n.includes('gasolina') || n.includes('uber')) return <Car size={18} />
  if (n.includes('invest') || n.includes('poupança') || n.includes('cripto') || n.includes('ações')) return <TrendingUp size={18} />
  if (n.includes('salário') || n.includes('renda') || n.includes('freela') || n.includes('pagamento')) return <Coins size={18} />
  if (n.includes('cartão') || n.includes('fatura') || n.includes('boleto')) return <FileText size={18} />
  return <CircleDollarSign size={18} />
}

function App() {
  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem('finance_incomes')
    return saved ? JSON.parse(saved) : DEFAULT_INCOMES
  })

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('finance_expenses')
    return saved ? JSON.parse(saved) : DEFAULT_EXPENSES
  })

  useEffect(() => {
    localStorage.setItem('finance_incomes', JSON.stringify(incomes))
  }, [incomes])

  useEffect(() => {
    localStorage.setItem('finance_expenses', JSON.stringify(expenses))
  }, [expenses])

  const totalIncome = incomes.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0)
  const totalExpense = expenses.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0)
  const balance = totalIncome - totalExpense

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  // Handlers para Incomes
  const updateIncome = (id, field, value) => {
    setIncomes(incomes.map(item => item.id === id ? { ...item, [field]: value } : item))
  }
  const addIncome = () => setIncomes([...incomes, { id: generateId(), name: 'Nova Renda', amount: '' }])
  const removeIncome = (id) => setIncomes(incomes.filter(item => item.id !== id))

  // Handlers para Expenses
  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(item => item.id === id ? { ...item, [field]: value } : item))
  }
  const addExpense = () => setExpenses([...expenses, { id: generateId(), name: 'Nova Despesa', amount: '' }])
  const removeExpense = (id) => setExpenses(expenses.filter(item => item.id !== id))

  const getBalanceClass = () => {
    if (balance > 0) return 'balance-positive'
    if (balance < 0) return 'balance-negative'
    return 'balance-neutral'
  }

  // Preparando dados para os gráficos
  const pieData = expenses
    .filter(item => parseFloat(item.amount) > 0)
    .map(item => ({
      name: item.name || 'Sem nome',
      value: parseFloat(item.amount)
    }))

  const barData = [
    { name: 'Geral', Receitas: totalIncome, Despesas: totalExpense }
  ]

  // Custom Tooltip para o PieChart formatando como moeda
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ background: 'rgba(22, 27, 34, 0.9)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].name}</p>
          <p style={{ margin: 0, color: payload[0].payload.fill }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="app-container">
      {/* Coluna Esquerda: Formulários */}
      <div className="forms-section">
        <header className="header">
          <h1>Simulador de Orçamento</h1>
          <p>Planeje seu mês e acompanhe seu saldo em tempo real.</p>
        </header>

        {/* Categoria Incomes */}
        <section className="glass-panel form-group">
          <h2 className="panel-title">
            <DollarSign size={20} color="#79c0ff" />
            Entradas (Receitas)
          </h2>
          
          <div className="items-list">
            {incomes.map((item) => (
              <div key={item.id} className="input-row">
                <div className="category-icon" style={{color: '#79c0ff'}}>
                  {getIconForCategory(item.name)}
                </div>
                <input 
                  type="text" 
                  className="name-input"
                  value={item.name} 
                  onChange={(e) => updateIncome(item.id, 'name', e.target.value)}
                  placeholder="Nome da renda"
                />
                <div className="input-icon">R$</div>
                <input 
                  type="number" 
                  className="value-input"
                  value={item.amount} 
                  onChange={(e) => updateIncome(item.id, 'amount', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
                <button 
                  className="icon-btn" 
                  onClick={() => removeIncome(item.id)}
                  title="Remover Entrada"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={addIncome}>
            <Plus size={16} /> Adicionar Nova Renda
          </button>
        </section>

        <div style={{ height: '2rem' }}></div>

        {/* Categoria Expenses */}
        <section className="glass-panel form-group">
          <h2 className="panel-title">
            <CreditCard size={20} color="#ffa657" />
            Saídas (Despesas e Investimentos)
          </h2>
          
          <div className="items-list">
            {expenses.map((item) => (
              <div key={item.id} className="input-row">
                <div className="category-icon" style={{color: '#ffa657'}}>
                  {getIconForCategory(item.name)}
                </div>
                <input 
                  type="text" 
                  className="name-input"
                  value={item.name} 
                  onChange={(e) => updateExpense(item.id, 'name', e.target.value)}
                  placeholder="Nome da conta"
                />
                <div className="input-icon">R$</div>
                <input 
                  type="number" 
                  className="value-input"
                  value={item.amount} 
                  onChange={(e) => updateExpense(item.id, 'amount', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
                <button 
                  className="icon-btn" 
                  onClick={() => removeExpense(item.id)}
                  title="Remover Conta"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={addExpense}>
            <Plus size={16} /> Adicionar Nova Conta
          </button>
        </section>
      </div>

      {/* Coluna Direita: Resumo e Dashboards */}
      <div className="right-panels">
        <section className="glass-panel summary-panel-content">
          <h2 className="panel-title">
            <WalletCards size={20} color="#d2a8ff" />
            Resumo do Mês
          </h2>

          <div className="summary-item total-income">
            <span className="label">
              <TrendingUp size={16} />
              Total de Entradas
            </span>
            <span className="value">{formatCurrency(totalIncome)}</span>
          </div>

          <div className="summary-item total-expense">
            <span className="label">
              <TrendingUp size={16} style={{ transform: 'scaleY(-1)' }} />
              Total de Saídas
            </span>
            <span className="value">{formatCurrency(totalExpense)}</span>
          </div>

          <div className={`summary-total ${getBalanceClass()}`}>
            <h3>Saldo Restante</h3>
            <div className="balance-value">
              {formatCurrency(balance)}
            </div>
            {balance < 0 && (
              <p style={{marginTop: '10px', fontSize: '0.85rem'}}>Atenção: Seu orçamento estourou!</p>
            )}
            {balance > 0 && (
              <p style={{marginTop: '10px', fontSize: '0.85rem'}}>Ótimo: Você está dentro do orçamento. Guarde o restante!</p>
            )}
          </div>
        </section>

        {/* Dashboard com Gráficos */}
        {(totalIncome > 0 || totalExpense > 0) && (
          <section className="glass-panel dashboard-section" style={{ marginTop: '2rem' }}>
            <h2 className="panel-title">
              <PieChartIcon size={20} color="#79c0ff" />
              Dashboard Analítico
            </h2>
            
            {/* Gráfico de Barras: Entradas x Saídas */}
            <div className="chart-container" style={{ height: 220, marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center' }}>
                Comparativo Geral
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#7d8590" fontSize={12} />
                  <YAxis stroke="#7d8590" fontSize={12} tickFormatter={(val) => `R$${val}`} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: 'rgba(22, 27, 34, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Receitas" fill="#3fb950" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Despesas" fill="#f85149" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Pizza: Divisão de Despesas */}
            {pieData.length > 0 && (
              <div className="chart-container" style={{ height: 260 }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textAlign: 'center' }}>
                  Distribuição de Despesas
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      iconType="circle" 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default App
