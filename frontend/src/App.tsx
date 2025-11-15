import { useState } from 'react';
import axios from 'axios';
import './App.css';

interface Review {
  publisher: string;
  title: string;
  url: string;
  text: string;
  rating: string;
}

interface FactCheckResult {
  claim: string;
  found: boolean;
  reviews: Review[];
}

interface AiInsight {
  insight: string;
  sources: string;
}

function App() {
  const [claim, setClaim] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [error, setError] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [currentView, setCurrentView] = useState<'search' | 'results' | 'detail'>('search');
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);

  const generateAiInsight = async (claimText: string): Promise<AiInsight> => {
    const lowerClaim = claimText.toLowerCase();
    
    const mockAiResponse: AiInsight = {
      insight: `Based on general knowledge about "${claimText}": This claim appears to be making a statement that may require verification. Without specific fact-check results, it's important to consult reliable sources and scientific evidence. The claim touches on topics that should be examined through established research and credible information sources.`,
      sources: 'Recommended verification sources: Google Fact Check Tools, PolitiFact, FactCheck.org, academic journals, government agencies'
    };
    
    return mockAiResponse;
  };

  const checkClaim = async (): Promise<void> => {
    if (!claim.trim()) {
      setError('Please enter a claim to verify');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);
    setHasSearched(true);
    setSelectedReview(null);
    setCurrentView('results');
    setIsHelpful(null);

    try {
      const response = await axios.post<FactCheckResult>('http://127.0.0.1:8000/fact-check', {
        claim: claim.trim()
      });
      
      setResult(response.data);
      
      // Generate AI insight based on the actual claim
      const insightData = await generateAiInsight(claim.trim());
      setAiInsight(insightData);
      
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to verify claim. Please try again.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingColor = (rating: string): string => {
    if (!rating || rating === 'No rating') return '#4b5563';
    
    const lowerRating = rating.toLowerCase();
    if (lowerRating.includes('false') || lowerRating.includes('misleading')) {
      return '#dc2626';
    } else if (lowerRating.includes('true') || lowerRating.includes('correct')) {
      return '#16a34a';
    }
    return '#4b5563';
  };

  const handleReviewClick = (review: Review): void => {
    setSelectedReview(review);
    setCurrentView('detail');
  };

  const handleBackToResults = (): void => {
    setCurrentView('results');
    setSelectedReview(null);
  };

  const handleNewSearch = (): void => {
    setCurrentView('search');
    setClaim('');
    setResult(null);
    setSelectedReview(null);
    setHasSearched(false);
    setAiInsight(null);
    setIsHelpful(null);
  };

  const handleHelpfulClick = (helpful: boolean): void => {
    setIsHelpful(helpful);
  };

  // Search View
  if (currentView === 'search') {
    return (
      <div className="app">
        <div className="container">
          <div className="border-container search-view">
            <div className="header-bar">
              <h2 className="header-title">TrueScope</h2>
            </div>
            
            <div className="content-area">
              <h1 className="main-title">TrueScope</h1>
              <p className="subtitle">Check the facts in seconds.</p>
              <p className="description">Paste a claim below to verify it using trusted sources.</p>
              
              <div className="input-section">
                <textarea
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  placeholder="Paste a statement here... e.g. 'The earth is flat.'"
                  className="claim-input"
                />
                <div className="button-container">
                  <button
                    onClick={checkClaim}
                    disabled={isLoading}
                    className="verify-button"
                  >
                    {isLoading ? 'Checking Credibility...' : 'Check Credibility'}
                  </button>
                </div>
              </div>
              
              <p className="powered-by">Powered by Google Fact Check Tools, PolitiFact, and FactCheck.org.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detailed Review View
  if (currentView === 'detail' && selectedReview) {
    return (
      <div className="app">
        <div className="container">
          <div className="border-container">
            <div className="header-bar">
              <h2 className="header-title">TrueScope</h2>
            </div>
            
            <div className="content-area detailed-view">
              <div className="navigation-section">
                <button 
                  onClick={handleBackToResults}
                  className="nav-button"
                >
                  ← Back to Results
                </button>
                <button 
                  onClick={handleNewSearch}
                  className="nav-button"
                >
                  New Search
                </button>
              </div>
              
              <div className="detailed-review">
                <div className="review-header">
                  <h1 className="main-title">TrueScope</h1>
                  <p className="claim-statement">Claim: {result?.claim}</p>
                </div>
                
                <div className="review-content">
                  <h2 className="review-title-main">{selectedReview.title}</h2>
                  
                  <div className="review-meta">
                    <span className="review-publisher">By {selectedReview.publisher}</span>
                    <span 
                      className="review-rating" 
                      style={{ color: getRatingColor(selectedReview.rating) }}
                    >
                      Rating: {selectedReview.rating}
                    </span>
                  </div>
                  
                  <div className="review-text">
                    <p>{selectedReview.text === 'No review text' 
                      ? `This fact-check by ${selectedReview.publisher} examines the claim "${result?.claim}". The review provides analysis and verification of this statement using available evidence and reliable sources.` 
                      : selectedReview.text}
                    </p>
                  </div>
                  
                  <div className="review-actions">
                    <a 
                      href={selectedReview.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="full-article-button"
                    >
                      Read Full Article
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results View
  return (
    <div className="app">
      <div className="container">
        {/* Loading State */}
        {isLoading && (
          <div className="border-container loading-container">
            <div className="loading-content">
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span className="loading-text">Verifying claim...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="border-container error-container">
            <p className="error-text">{error}</p>
          </div>
        )}

        {/* Results State */}
        {!isLoading && result && (
          <div className="results-container">
            <div className="border-container">
              <div className="results-header">
                <h2 className="header-title">TrueScope</h2>
              </div>
              
              <div className="content-area">
                <div className="navigation-section">
                  <button 
                    onClick={handleNewSearch}
                    className="nav-button"
                  >
                    New Search
                  </button>
                </div>
                
                <div className="claim-header">
                  <h1 className="main-title">TrueScope</h1>
                  <p className="claim-statement">Claim: {result.claim}</p>
                  <p 
                    className="credibility-score" 
                    style={{ color: getRatingColor(result.found ? 'True' : 'False') }}
                  >
                    Fact-Check Status: {result.found ? 'Found' : 'Not Found'}
                  </p>
                </div>
                
                {result.found ? (
                  <>
                    <div className="ai-summary-section">
                      <h3 className="section-title">Fact-Check Results</h3>
                      <p className="summary-text">
                        Found {result.reviews?.length || 0} fact-check results from various sources.
                      </p>
                    </div>
                    
                    <div className="source-breakdown">
                      <h3 className="section-title">Source Breakdown</h3>
                      <div className="reviews-grid">
                        {result.reviews?.map((review, index) => (
                          <div 
                            key={index} 
                            className="review-card"
                            onClick={() => handleReviewClick(review)}
                          >
                            <div className="card-header">
                              <span className="card-publisher">{review.publisher}</span>
                              <span 
                                className="card-rating" 
                                style={{ color: getRatingColor(review.rating) }}
                              >
                                {review.rating}
                              </span>
                            </div>
                            <h4 className="card-title">{review.title}</h4>
                            <p className="card-text">
                              {review.text === 'No review text' 
                                ? `This fact-check examines the claim and provides verification analysis.` 
                                : review.text}
                            </p>
                            <div className="card-link">
                              Click to view details →
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* No Results Found State - AI Insight View */
                  <div className="no-result-section">
                    <p className="no-result-text">No direct fact-check found.</p>
                    
                    <div className="ai-insight-section">
                      <h3 className="ai-insight-title">AI-Powered Insight</h3>
                      <div className="ai-insight-text">
                        {aiInsight?.insight ? (
                          <>
                            {aiInsight.insight.split('\n').map((line, index) => (
                              <div key={index}>
                                {line}
                                {index < aiInsight.insight.split('\n').length - 1 && (
                                  <>
                                    <br />
                                    <br />
                                  </>
                                )}
                              </div>
                            ))}
                          </>
                        ) : (
                          'Generating AI insight...'
                        )}
                      </div>
                      
                      <div className="source-references">
                        <p>Source references: {aiInsight?.sources || 'Various reliable sources and fact-checking organizations'}</p>
                      </div>
                      
                      <div className="helpful-section">
                        <p className="helpful-question">Was this insight helpful?</p>
                        <div className="helpful-buttons">
                          <button 
                            className={`helpful-btn ${isHelpful === true ? 'helpful-yes active' : 'helpful-yes'}`}
                            onClick={() => handleHelpfulClick(true)}
                          >
                            Yes
                          </button>
                          <button 
                            className={`helpful-btn ${isHelpful === false ? 'helpful-no active' : 'helpful-no'}`}
                            onClick={() => handleHelpfulClick(false)}
                          >
                            No
                          </button>
                        </div>
                      </div>
                      
                      <p className="disclaimer">
                        This AI insight is not an official fact-check. Always verify with primary sources.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;