import { useState, useEffect } from 'react'
import {
  Plus, Trash2, DollarSign, CreditCard, TrendingUp, WalletCards,
  ShoppingCart, Utensils, Zap, Droplets, Home, Car, Coins,
  CircleDollarSign, FileText, PieChart as PieChartIcon, BarChart2,
  Sun, Moon, Lightbulb
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

const getColorForExpense = (name) => {
  const n = name.toLowerCase()
  if (n.includes('investimento') || n.includes('poupança') || n.includes('cripto') || n.includes('ações')) return '#3fb950' // Verde
  if (n.includes('compra') || n.includes('mercado') || n.includes('loja')) return '#ffa657' // Laranja
  if (n.includes('conta') || n.includes('obrigatória') || n.includes('fatura') || n.includes('boleto')) return '#f85149' // Vermelho
  
  // Cores de fallback para outras categorias caso o usuário crie
  if (n.includes('alimentação') || n.includes('comida') || n.includes('ifood') || n.includes('restaurante')) return '#d2a8ff' // Roxo claro
  if (n.includes('carro') || n.includes('transporte') || n.includes('gasolina') || n.includes('uber')) return '#79c0ff' // Azul claro
  if (n.includes('luz') || n.includes('energia') || n.includes('água') || n.includes('agua')) return '#a5d6ff' // Azul muito claro
  
  return '#e3b341' // Amarelo escuro padrão
}

const EXPENSE_CATEGORIES = [
  { id: 'cat_alimentacao', name: 'Alimentação', icon: Utensils, color: '#d2a8ff' },
  { id: 'cat_cartao', name: 'Cartão/Fatura', icon: FileText, color: '#f85149' },
  { id: 'cat_contas', name: 'Contas Fixas', icon: Zap, color: '#a5d6ff' },
  { id: 'cat_investimento', name: 'Investimento', icon: TrendingUp, color: '#3fb950' },
  { id: 'cat_pensao', name: 'Pensão/Filhos', icon: Baby, color: '#e3b341' },
  { id: 'cat_lazer', name: 'Lazer', icon: Film, color: '#ff7b72' },
  { id: 'cat_transporte', name: 'Transporte', icon: Car, color: '#79c0ff' },
  { id: 'cat_saude', name: 'Saúde', icon: HeartPulse, color: '#ffbdc6' },
  { id: 'cat_outros', name: 'Outro gasto...', icon: CircleDollarSign, color: '#7d8590' }
]

const INCOME_CATEGORIES = [
  { id: 'inc_salario', name: 'Salário', icon: Coins, color: '#79c0ff' },
  { id: 'inc_freela', name: 'Freelance', icon: TrendingUp, color: '#3fb950' },
  { id: 'inc_vendas', name: 'Vendas', icon: ShoppingCart, color: '#d2a8ff' },
  { id: 'inc_outros', name: 'Outra entrada...', icon: CircleDollarSign, color: '#7d8590' }
]

function App() {
  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem('finance_incomes')
    return saved ? JSON.parse(saved) : DEFAULT_INCOMES
  })

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('finance_expenses')
    return saved ? JSON.parse(saved) : DEFAULT_EXPENSES
  })

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finance_theme') || 'dark'
  })

  // User Name state
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('finance_user_name') || ''
  })

  useEffect(() => {
    localStorage.setItem('finance_incomes', JSON.stringify(incomes))
  }, [incomes])

  useEffect(() => {
    localStorage.setItem('finance_expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('finance_theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('finance_user_name', userName)
  }, [userName])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

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
  const addSpecificIncome = (name) => setIncomes([...incomes, { id: generateId(), name: name, amount: '' }])
  const removeIncome = (id) => setIncomes(incomes.filter(item => item.id !== id))

  // Handlers para Expenses
  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(item => item.id === id ? { ...item, [field]: value } : item))
  }
  const addExpense = () => setExpenses([...expenses, { id: generateId(), name: 'Nova Conta', amount: '' }])
  const addSpecificExpense = (name) => setExpenses([...expenses, { id: generateId(), name: name, amount: '' }])
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
      const baseTotal = totalIncome > 0 ? totalIncome : totalExpense;
      const percentage = baseTotal > 0 ? ((payload[0].value / baseTotal) * 100).toFixed(1) : 0;
      const baseLabel = totalIncome > 0 ? 'da Renda' : 'do Total';
      return (
        <div className="custom-tooltip" style={{ background: 'rgba(22, 27, 34, 0.9)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#e6edf3' }}>{payload[0].name}</p>
          <p style={{ margin: 0, color: payload[0].payload.fill, marginTop: '4px' }}>
            {formatCurrency(payload[0].value)} ({percentage}% {baseLabel})
          </p>
        </div>
      );
    }
    return null;
  };

  const investmentItem = expenses.find(e => e.name.toLowerCase().includes('investimento'));
  const investmentAmount = investmentItem ? (parseFloat(investmentItem.amount) || 0) : 0;
  const investmentGoal = totalIncome * 0.20;
  const investmentProgress = investmentGoal > 0 ? Math.min((investmentAmount / investmentGoal) * 100, 100) : 0;

  // Lógica de Insights Automáticos
  const generateInsights = () => {
    if (totalIncome === 0) return [{ type: 'info', text: 'Adicione suas rendas para ver insights financeiros personalizados.' }]
    
    const insightsList = []
    
    // 1. Regra 50/30/20 - Necessidades (50%)
    const fixedExpenses = expenses.filter(e => {
       const n = e.name.toLowerCase()
       return n.includes('conta') || n.includes('fatura') || n.includes('luz') || n.includes('água') || n.includes('aluguel') || n.includes('alimentação') || n.includes('mercado') || n.includes('pensão');
    }).reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0)
    
    const fixedPercentage = (fixedExpenses / totalIncome) * 100
    if (fixedPercentage > 55) {
      insightsList.push({ type: 'warning', text: `Atenção: Seus gastos essenciais estão em ${fixedPercentage.toFixed(0)}% da renda. Pela regra 50/30/20, o ideal é tentar não passar de 50%.` })
    } else if (fixedPercentage > 0) {
      insightsList.push({ type: 'success', text: `Controle perfeito! Seus gastos essenciais consomem ${fixedPercentage.toFixed(0)}% da sua renda, dentro do recomendado.` })
    }

    // 2. Investimentos (20%)
    if (investmentProgress >= 100) {
      insightsList.push({ type: 'success', text: 'Excelente! Você atingiu a meta de ouro e guardou ao menos 20% do que ganha.' })
    } else if (investmentAmount > 0) {
      insightsList.push({ type: 'info', text: `Você investiu ${((investmentAmount / totalIncome) * 100).toFixed(0)}% da renda até o momento. Tente chegar nos 20%.` })
    } else {
      insightsList.push({ type: 'warning', text: 'Nenhum investimento registrado. Pague a si mesmo primeiro! Guarde algo assim que o salário cair.' })
    }

    // 3. Saúde do Saldo
    if (balance < 0) {
      insightsList.push({ type: 'danger', text: 'ALERTA VERMELHO: Você está gastando mais do que arrecada. Revise compras de lazer e cartão de crédito urgentemente!' })
    } else if (balance > totalIncome * 0.25) {
      insightsList.push({ type: 'info', text: `Sobrou um bom caixa (${formatCurrency(balance)}). Considere reforçar sua reserva de emergência!` })
    }

    return insightsList
  }

  const insights = generateInsights()

  return (
    <div className="app-container fade-in">
      {/* Coluna Esquerda: Formulários */}
      <div className="forms-section">
        <header className="header" style={{ position: 'relative' }}>
          <button 
            onClick={toggleTheme} 
            className="icon-btn" 
            style={{ position: 'absolute', right: 0, top: 0, padding: '8px', background: 'var(--glass-bg)', borderRadius: '50%', border: '1px solid var(--glass-border)' }}
            title={theme === 'dark' ? "Modo Claro" : "Modo Noturno"}
          >
            {theme === 'dark' ? <Sun size={20} color="#e3b341" /> : <Moon size={20} color="#4a6ee0" />}
          </button>
          <h1>
            Olá, <input 
               type="text" 
               value={userName} 
               onChange={(e) => setUserName(e.target.value)} 
               placeholder="Seu nome..." 
               style={{ 
                 background: 'transparent', 
                 border: 'none', 
                 borderBottom: '2px dashed var(--glass-border)', 
                 color: 'var(--text)', 
                 fontSize: 'inherit', 
                 fontWeight: 'inherit', 
                 fontFamily: 'inherit',
                 outline: 'none',
                 width: userName ? `${Math.max(userName.length + 1, 10)}ch` : '10ch',
                 transition: 'all 0.2s ease'
               }} 
            /> 👋
          </h1>
          <p>Seu assistente financeiro. Planeje seu mês e acompanhe seu saldo em tempo real.</p>
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
          <div className="quick-add-categories">
            <p className="quick-add-title">Adicionar recebimento rapidamente:</p>
            <div className="category-chips">
              {INCOME_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <button 
                    key={cat.id} 
                    className="category-chip" 
                    style={{ '--chip-color': cat.color }}
                    onClick={() => addSpecificIncome(cat.name)}
                    title={`Adicionar ${cat.name}`}
                  >
                    <Icon size={14} color={cat.color} /> {cat.name}
                  </button>
                )
              })}
            </div>
          </div>
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
          <div className="quick-add-categories">
            <p className="quick-add-title">Adicionar gasto rapidamente:</p>
            <div className="category-chips">
              {EXPENSE_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <button 
                    key={cat.id} 
                    className="category-chip" 
                    style={{ '--chip-color': cat.color }}
                    onClick={() => addSpecificExpense(cat.name)}
                    title={`Adicionar ${cat.name}`}
                  >
                    <Icon size={14} color={cat.color} /> {cat.name}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Coluna Direita: Resumo e Dashboards */}
      <div className="right-panels">
        <section className="glass-panel summary-panel-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="panel-title" style={{ width: '100%', justifyContent: 'center', borderBottom: 'none', marginBottom: '0.5rem' }}>
            <WalletCards size={20} color="var(--primary)" />
            Dashboard do Mês
          </h2>

          {/* Gráfico de Rosca Centralizado */}
          {pieData.length > 0 ? (
            <div className="chart-container" style={{ height: 320, width: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColorForExpense(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    iconType="circle" 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Texto Central do Saldo */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Saldo Restante</span>
                <br />
                <strong className={getBalanceClass()} style={{ fontSize: '1.4rem' }}>{formatCurrency(balance)}</strong>
              </div>
            </div>
          ) : (
            <div className={`summary-total ${getBalanceClass()}`} style={{ padding: '12px', borderRadius: '8px', textAlign: 'center', width: '100%', margin: '2rem 0' }}>
              <h3 style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '4px' }}>Saldo Restante</h3>
              <div className="balance-value" style={{ fontSize: '1.4rem' }}>
                {formatCurrency(balance)}
              </div>
            </div>
          )}

          {/* Gráfico de Progresso de Investimento */}
          <div className="investment-progress" style={{ width: '100%', marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text)', margin: 0 }}>
                Meta de Investimento (20% da Renda)
              </h3>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#3fb950' }}>{investmentProgress.toFixed(0)}%</span>
            </div>
            
            <div 
              className={investmentProgress >= 100 ? "glow-effect" : ""}
              style={{ background: 'var(--glass-border)', borderRadius: '12px', height: '18px', overflow: 'hidden', position: 'relative' }}
            >
              <div style={{ 
                height: '100%', 
                width: `${investmentProgress}%`, 
                background: investmentProgress >= 100 ? '#3fb950' : 'linear-gradient(90deg, #2ea043, #3fb950)',
                transition: 'width 0.5s ease-in-out',
                borderRadius: '12px'
              }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Atual: {formatCurrency(investmentAmount)}</span>
              <span>Meta: {formatCurrency(investmentGoal)}</span>
            </div>
          </div>
        </section>

        {/* Gráfico Analítico Adicional */}
        {(totalIncome > 0 || totalExpense > 0) && (
          <section className="glass-panel dashboard-section" style={{ marginTop: '2rem' }}>
            <h2 className="panel-title">
              <BarChart2 size={20} color="#79c0ff" />
              Comparativo Analítico
            </h2>
            
            {/* Gráfico de Barras: Entradas x Saídas */}
            <div className="chart-container" style={{ height: 200, marginBottom: '1rem' }}>
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
          </section>
        )}

        {/* Insights Inteligentes */}
        {totalIncome > 0 && (
          <section className="glass-panel dashboard-section" style={{ marginTop: '2rem' }}>
            <h2 className="panel-title">
              <Lightbulb size={20} color="#e3b341" />
              Insights Inteligentes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {insights.map((insight, idx) => {
                let bg, border, textColor;
                if (insight.type === 'success') {
                  bg = 'rgba(63, 185, 80, 0.1)'
                  border = 'rgba(63, 185, 80, 0.3)'
                  textColor = 'var(--success)'
                } else if (insight.type === 'warning') {
                  bg = 'rgba(227, 179, 65, 0.1)'
                  border = 'rgba(227, 179, 65, 0.3)'
                  textColor = '#e3b341'
                } else if (insight.type === 'danger') {
                  bg = 'rgba(248, 81, 73, 0.1)'
                  border = 'rgba(248, 81, 73, 0.3)'
                  textColor = 'var(--danger)'
                } else {
                  bg = 'rgba(121, 192, 255, 0.1)'
                  border = 'rgba(121, 192, 255, 0.3)'
                  textColor = '#79c0ff'
                }

                return (
                  <div key={idx} style={{ 
                    background: bg, border: `1px solid ${border}`, 
                    padding: '12px 16px', borderRadius: '8px', 
                    color: 'var(--text)', fontSize: '0.9rem',
                    borderLeft: `4px solid ${textColor}`
                  }}>
                    {insight.text}
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default App
