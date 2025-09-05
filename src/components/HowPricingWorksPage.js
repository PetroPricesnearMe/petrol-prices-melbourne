import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './HowPricingWorksPage.css';

const HowPricingWorksPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'factors', label: 'Price Factors', icon: '⚖️' },
    { key: 'cycle', label: 'Price Cycle', icon: '🔄' },
    { key: 'regulations', label: 'Regulations', icon: '📋' },
    { key: 'tips', label: 'Saving Tips', icon: '💡' }
  ];

  const content = {
    overview: {
      title: 'How Fuel Pricing Works in Australia',
      description: 'Understanding the complex factors that influence petrol prices across Australia',
      content: (
        <div className="content-section">
          <div className="intro-card">
            <h3>Fuel Pricing in Australia</h3>
            <p>
              Australia's fuel pricing system is influenced by a complex interplay of global oil markets, 
              local competition, government policies, and regional factors. Understanding these dynamics 
              can help you make informed decisions about when and where to fill up.
            </p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🌍</div>
              <h4>Global Oil Prices</h4>
              <p>60-70% of fuel cost comes from international crude oil prices</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏪</div>
              <h4>Local Competition</h4>
              <p>Station density and competition significantly affect local pricing</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <h4>Price Cycles</h4>
              <p>Weekly cycles with predictable high and low price periods</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏛️</div>
              <h4>Government Taxes</h4>
              <p>Federal excise and GST make up about 40% of total fuel cost</p>
            </div>
          </div>
        </div>
      )
    },
    factors: {
      title: 'Key Price Factors',
      description: 'The main elements that determine fuel prices at the pump',
      content: (
        <div className="content-section">
          <div className="factors-list">
            <div className="factor-item">
              <div className="factor-header">
                <span className="factor-icon">🛢️</span>
                <h4>International Crude Oil Prices</h4>
                <span className="factor-impact high">High Impact</span>
              </div>
              <p>
                The largest component of fuel pricing. Global oil prices fluctuate based on supply, 
                demand, geopolitical events, and economic conditions. Changes in international 
                prices typically take 1-2 weeks to affect Australian pump prices.
              </p>
            </div>
            
            <div className="factor-item">
              <div className="factor-header">
                <span className="factor-icon">🏛️</span>
                <h4>Government Taxes & Levies</h4>
                <span className="factor-impact high">High Impact</span>
              </div>
              <p>
                Federal excise duty (currently ~42¢ per liter) plus GST (10%) and state levies. 
                These are fixed costs that don't change with oil prices, making up approximately 
                40% of the total fuel cost.
              </p>
            </div>
            
            <div className="factor-item">
              <div className="factor-header">
                <span className="factor-icon">🏭</span>
                <h4>Refining & Distribution</h4>
                <span className="factor-impact medium">Medium Impact</span>
              </div>
              <p>
                Costs for refining crude oil into petrol, transportation from refineries to 
                terminals, and distribution to service stations. These costs are relatively 
                stable but can vary with distance and infrastructure.
              </p>
            </div>
            
            <div className="factor-item">
              <div className="factor-header">
                <span className="factor-icon">🏪</span>
                <h4>Local Competition & Location</h4>
                <span className="factor-impact medium">Medium Impact</span>
              </div>
              <p>
                Station density, local competition, and location significantly affect pricing. 
                Stations near highways or in high-rent areas often charge more due to 
                convenience premiums and higher operating costs.
              </p>
            </div>
            
            <div className="factor-item">
              <div className="factor-header">
                <span className="factor-icon">💱</span>
                <h4>Exchange Rates</h4>
                <span className="factor-impact medium">Medium Impact</span>
              </div>
              <p>
                Since oil is traded in US dollars, the AUD/USD exchange rate affects the 
                cost of imported crude oil. A weaker Australian dollar increases fuel costs 
                for consumers.
              </p>
            </div>
            
            <div className="factor-item">
              <div className="factor-header">
                <span className="factor-icon">📅</span>
                <h4>Seasonal Demand</h4>
                <span className="factor-impact low">Low Impact</span>
              </div>
              <p>
                Higher demand during holiday periods, school holidays, and summer driving 
                seasons can lead to temporary price increases, though the effect is usually 
                modest compared to other factors.
              </p>
            </div>
          </div>
        </div>
      )
    },
    cycle: {
      title: 'The Price Cycle',
      description: 'Understanding Australia\'s unique weekly fuel price cycle',
      content: (
        <div className="content-section">
          <div className="cycle-explanation">
            <h3>Australia's Weekly Price Cycle</h3>
            <p>
              Unlike many countries, Australia has a predictable weekly price cycle where 
              prices rise and fall in a regular pattern. This cycle varies by city and 
              can be used to your advantage.
            </p>
          </div>
          
          <div className="cycle-timeline">
            <div className="timeline-item">
              <div className="timeline-day">Monday</div>
              <div className="timeline-content">
                <h4>Cycle Begins</h4>
                <p>Prices typically start low and begin rising gradually</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-day">Tuesday</div>
              <div className="timeline-content">
                <h4>Rising Phase</h4>
                <p>Prices continue to increase as the week progresses</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-day">Wednesday</div>
              <div className="timeline-content">
                <h4>Peak Period</h4>
                <p>Prices often reach their highest point mid-week</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-day">Thursday</div>
              <div className="timeline-content">
                <h4>High Prices</h4>
                <p>Prices remain elevated, some stations may drop</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-day">Friday</div>
              <div className="timeline-content">
                <h4>Weekend Peak</h4>
                <p>Highest prices of the week due to increased demand</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-day">Saturday</div>
              <div className="timeline-content">
                <h4>Cycle Reset</h4>
                <p>Prices begin to drop as the cycle resets</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-day">Sunday</div>
              <div className="timeline-content">
                <h4>Lowest Prices</h4>
                <p>Best day to fill up - prices at their lowest</p>
              </div>
            </div>
          </div>
          
          <div className="cycle-tips">
            <h3>Using the Cycle to Your Advantage</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <span className="tip-icon">📅</span>
                <h4>Best Days to Buy</h4>
                <p>Sunday and Monday typically offer the lowest prices</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">⏰</span>
                <h4>Best Times</h4>
                <p>Early morning or late evening often have better prices</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🚫</span>
                <h4>Avoid These Days</h4>
                <p>Friday and Saturday usually have the highest prices</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">📱</span>
                <h4>Use Apps</h4>
                <p>Price comparison apps help track the cycle in real-time</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    regulations: {
      title: 'Government Regulations',
      description: 'How government policies and regulations affect fuel pricing',
      content: (
        <div className="content-section">
          <div className="regulations-overview">
            <h3>Government Role in Fuel Pricing</h3>
            <p>
              The Australian government plays a significant role in fuel pricing through 
              taxation, regulation, and monitoring. Understanding these policies helps 
              explain why fuel costs what it does.
            </p>
          </div>
          
          <div className="regulations-list">
            <div className="regulation-item">
              <div className="regulation-header">
                <span className="regulation-icon">💰</span>
                <h4>Federal Excise Duty</h4>
              </div>
              <div className="regulation-details">
                <p><strong>Current Rate:</strong> ~42.3¢ per liter</p>
                <p><strong>Purpose:</strong> Infrastructure funding and general revenue</p>
                <p><strong>Indexation:</strong> Adjusted twice yearly with CPI</p>
                <p>
                  This is the largest single component of fuel pricing, making up approximately 
                  25-30% of the total cost. It's a fixed cost that doesn't change with oil prices.
                </p>
              </div>
            </div>
            
            <div className="regulation-item">
              <div className="regulation-header">
                <span className="regulation-icon">📊</span>
                <h4>Goods and Services Tax (GST)</h4>
              </div>
              <div className="regulation-details">
                <p><strong>Rate:</strong> 10% on the final price</p>
                <p><strong>Scope:</strong> Applied to the total price including excise</p>
                <p><strong>Purpose:</strong> General government revenue</p>
                <p>
                  GST is applied to the final retail price, including the excise duty, 
                  effectively creating a tax on a tax. This adds approximately 10-15¢ per liter.
                </p>
              </div>
            </div>
            
            <div className="regulation-item">
              <div className="regulation-header">
                <span className="regulation-icon">🏛️</span>
                <h4>State Levies and Taxes</h4>
              </div>
              <div className="regulation-details">
                <p><strong>Varies by State:</strong> Additional levies in some states</p>
                <p><strong>Examples:</strong> NSW fuel levy, WA fuel levy</p>
                <p><strong>Purpose:</strong> State infrastructure and transport funding</p>
                <p>
                  Some states impose additional levies on fuel, typically 1-3¢ per liter. 
                  These vary significantly between states and can affect regional pricing.
                </p>
              </div>
            </div>
            
            <div className="regulation-item">
              <div className="regulation-header">
                <span className="regulation-icon">📋</span>
                <h4>Price Monitoring and Transparency</h4>
              </div>
              <div className="regulation-details">
                <p><strong>ACCC Monitoring:</strong> Regular price surveillance</p>
                <p><strong>Price Reporting:</strong> Mandatory price reporting in some states</p>
                <p><strong>Consumer Protection:</strong> Anti-competitive behavior prevention</p>
                <p>
                  The Australian Competition and Consumer Commission (ACCC) monitors fuel 
                  pricing to ensure competitive markets and prevent anti-competitive behavior.
                </p>
              </div>
            </div>
          </div>
          
          <div className="policy-impact">
            <h3>Policy Impact on Consumers</h3>
            <div className="impact-grid">
              <div className="impact-card">
                <h4>Tax Burden</h4>
                <p>Government taxes make up ~40% of total fuel cost</p>
              </div>
              <div className="impact-card">
                <h4>Price Stability</h4>
                <p>Fixed taxes provide some price stability during oil price volatility</p>
              </div>
              <div className="impact-card">
                <h4>Regional Variation</h4>
                <p>State levies create regional price differences</p>
              </div>
              <div className="impact-card">
                <h4>Transparency</h4>
                <p>Government monitoring helps maintain competitive markets</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    tips: {
      title: 'Fuel Saving Tips',
      description: 'Practical advice to reduce your fuel costs and consumption',
      content: (
        <div className="content-section">
          <div className="tips-intro">
            <h3>Maximize Your Fuel Savings</h3>
            <p>
              Beyond finding the cheapest prices, there are many ways to reduce your 
              overall fuel costs through better driving habits, vehicle maintenance, 
              and smart planning.
            </p>
          </div>
          
          <div className="tips-categories">
            <div className="tip-category">
              <h4>🚗 Driving Habits</h4>
              <div className="tip-list">
                <div className="tip-item">
                  <span className="tip-icon">🐌</span>
                  <div>
                    <h5>Smooth Acceleration</h5>
                    <p>Gradual acceleration can improve fuel efficiency by 10-15%</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🛑</span>
                  <div>
                    <h5>Anticipate Stops</h5>
                    <p>Coast to stops instead of braking hard at the last moment</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">⚡</span>
                  <div>
                    <h5>Maintain Speed</h5>
                    <p>Use cruise control on highways to maintain consistent speed</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🚫</span>
                  <div>
                    <h5>Avoid Idling</h5>
                    <p>Turn off engine when stopped for more than 30 seconds</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="tip-category">
              <h4>🔧 Vehicle Maintenance</h4>
              <div className="tip-list">
                <div className="tip-item">
                  <span className="tip-icon">🛞</span>
                  <div>
                    <h5>Proper Tire Pressure</h5>
                    <p>Underinflated tires can reduce fuel efficiency by 3%</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🔧</span>
                  <div>
                    <h5>Regular Servicing</h5>
                    <p>Well-maintained engines run more efficiently</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🌬️</span>
                  <div>
                    <h5>Clean Air Filters</h5>
                    <p>Dirty air filters can reduce fuel efficiency by 10%</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">⚖️</span>
                  <div>
                    <h5>Reduce Weight</h5>
                    <p>Remove unnecessary items from your vehicle</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="tip-category">
              <h4>📱 Smart Planning</h4>
              <div className="tip-list">
                <div className="tip-item">
                  <span className="tip-icon">🗺️</span>
                  <div>
                    <h5>Plan Routes</h5>
                    <p>Combine errands into single trips to reduce driving</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">⏰</span>
                  <div>
                    <h5>Time Your Trips</h5>
                    <p>Avoid peak traffic times when possible</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">📱</span>
                  <div>
                    <h5>Use Apps</h5>
                    <p>Price comparison apps help find the cheapest fuel</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🚗</span>
                  <div>
                    <h5>Consider Alternatives</h5>
                    <p>Walking, cycling, or public transport for short trips</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="savings-calculator">
            <h3>Calculate Your Potential Savings</h3>
            <div className="calculator-grid">
              <div className="calculator-item">
                <h4>Weekly Fuel Cost</h4>
                <p>Track your current weekly fuel spending to identify savings opportunities</p>
              </div>
              <div className="calculator-item">
                <h4>Price Difference Impact</h4>
                <p>Filling up at 5¢ cheaper per liter saves $2.50 on a 50L tank</p>
              </div>
              <div className="calculator-item">
                <h4>Efficiency Improvements</h4>
                <p>10% better fuel efficiency saves $10-20 per week for average drivers</p>
              </div>
              <div className="calculator-item">
                <h4>Annual Savings</h4>
                <p>Combined strategies can save $500-1000+ per year</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <motion.div 
      className="how-pricing-works-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pricing-header">
        <div className="container">
          <motion.div 
            className="header-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>How Fuel Pricing Works in Australia</h1>
            <p>Understanding the factors that influence petrol prices to help you save money</p>
          </motion.div>
        </div>
      </div>

      <div className="pricing-content">
        <div className="container">
          <div className="content-layout">
            <motion.div 
              className="sidebar"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <nav className="section-nav">
                {sections.map(section => (
                  <button
                    key={section.key}
                    className={`nav-item ${activeSection === section.key ? 'active' : ''}`}
                    onClick={() => setActiveSection(section.key)}
                  >
                    <span className="nav-icon">{section.icon}</span>
                    <span className="nav-label">{section.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>

            <motion.div 
              className="main-content"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="content-header">
                <h2>{content[activeSection].title}</h2>
                <p>{content[activeSection].description}</p>
              </div>
              
              <div className="content-body">
                {content[activeSection].content}
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div 
            className="cta-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3>Ready to Find the Best Fuel Prices?</h3>
            <p>Put your knowledge to use with our live price comparison tools</p>
            <div className="cta-buttons">
              <Link to="/map" className="btn btn-primary">
                <span className="btn-text">View Live Map</span>
                <span className="btn-icon">🗺️</span>
              </Link>
              <Link to="/directory" className="btn btn-secondary">
                <span className="btn-text">Browse Directory</span>
                <span className="btn-icon">📋</span>
              </Link>
              <Link to="/fuel-price-trends" className="btn btn-outline">
                <span className="btn-text">View Trends</span>
                <span className="btn-icon">📈</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HowPricingWorksPage;
