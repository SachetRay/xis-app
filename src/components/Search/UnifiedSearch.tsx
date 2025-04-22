import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  IconButton,
  Avatar,
  Chip,
  alpha,
  useTheme,
  CircularProgress,
  Button,
  Divider,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  Send as SendIcon,
  Close as CloseIcon,
  ArrowUpward as ScrollToTopIcon,
  Delete as DeleteIcon,
  Chat as ChatIcon,
  Keyboard as KeyboardIcon,
  History as HistoryIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Tool } from '../../data/tools';
import { SearchResult, Message } from '../../types/search';

interface SearchResultGroup {
  type: 'tools' | 'data';
  title: string;
  results: SearchResult[];
}

interface UnifiedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => Promise<SearchResultGroup[]>;
  onChatSubmit: (message: string) => Promise<void>;
  searchResults: SearchResultGroup[];
  chatHistory: Message[];
  clearHistory: () => void;
  isChatMode: boolean;
  onResultClick: (result: Tool | SearchResult) => void;
}

const UnifiedSearch: React.FC<UnifiedSearchProps> = ({
  isOpen,
  onClose,
  onSearch,
  onChatSubmit,
  searchResults,
  chatHistory,
  clearHistory,
  isChatMode,
  onResultClick,
}) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close only if clicking the backdrop (not the content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (!isChatMode && value.trim()) {
      setIsLoading(true);
      await onSearch(value);
      setIsLoading(false);
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (query.trim()) {
        setIsLoading(true);
        await onChatSubmit(query);
        setQuery('');
        setIsLoading(false);
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 200);
  };

  const scrollToTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const keyboardShortcuts = [
    { key: '⌘ K', description: 'Open/Close Search' },
    { key: '⌘ /', description: 'Toggle Chat Mode' },
    { key: 'ESC', description: 'Close Search' },
    { key: '↑ ↓', description: 'Navigate Results' },
    { key: 'Enter', description: 'Select Result/Send Message' },
  ];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: {
              duration: 0.5,
              ease: [0.2, 0, 0.2, 1]
            }
          }}
          exit={{ 
            opacity: 0,
            transition: {
              duration: 0.4,
              ease: [0.2, 0, 0.2, 1]
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: alpha(theme.palette.background.default, 0.85),
            backdropFilter: 'blur(12px)',
            zIndex: theme.zIndex.modal,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            overflow: 'hidden',
          }}
          onClick={handleOverlayClick}
        >
          <motion.div
            ref={overlayContentRef}
            initial={{ 
              width: '800px',
              y: '-60vh',
              scale: 0.95,
            }}
            animate={{ 
              width: '80%',
              y: 0,
              scale: 1,
              transition: {
                duration: 0.7,
                ease: [0.2, 0.1, 0.3, 1],
                width: { 
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1]
                },
                y: { 
                  duration: 0.7,
                  ease: [0.2, 0.1, 0.3, 1]
                },
                scale: { 
                  duration: 0.7,
                  ease: [0.2, 0.1, 0.3, 1]
                }
              }
            }}
            exit={{ 
              width: '800px',
              y: '-60vh',
              scale: 0.95,
              transition: {
                duration: 0.6,
                ease: [0.4, 0.1, 0.3, 1]
              }
            }}
            style={{
              margin: '0 auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              minWidth: 'min(80%, 1200px)',
              maxWidth: '1400px',
              transformOrigin: 'center center',
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: {
                  delay: 0.4,
                  duration: 0.4
                }
              }}
              exit={{ 
                opacity: 0,
                transition: {
                  duration: 0.3
                }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                px: 3,
                mb: 2 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    icon={isChatMode ? <ChatIcon /> : <SearchIcon />}
                    label={isChatMode ? "Chat Mode" : "Search Mode"}
                    color="primary"
                    variant="filled"
                    sx={{ 
                      borderRadius: '12px',
                      height: '36px',
                      '& .MuiChip-label': {
                        px: 2,
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      },
                    }}
                  />
                  <Tooltip title="Toggle Keyboard Shortcuts">
                    <IconButton 
                      size="small"
                      onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.2),
                        }
                      }}
                    >
                      <KeyboardIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {chatHistory.length > 0 && (
                    <Tooltip title="Clear History">
                      <IconButton
                        onClick={clearHistory}
                        size="small"
                        sx={{
                          color: theme.palette.error.main,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                      bgcolor: alpha('#000', 0.05),
                      '&:hover': {
                        bgcolor: alpha('#000', 0.1),
                      }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </motion.div>

            {/* Keyboard Shortcuts Panel */}
            <AnimatePresence>
              {showKeyboardShortcuts && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ 
                    opacity: 1, 
                    height: 'auto', 
                    y: 0,
                    transition: {
                      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                      opacity: { duration: 0.2, delay: 0.1 },
                      y: { duration: 0.3, ease: 'easeOut' }
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    height: 0, 
                    y: -5,
                    transition: {
                      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                      opacity: { duration: 0.2 },
                      y: { duration: 0.2 }
                    }
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      mx: 3,
                      p: 2,
                      mb: 2,
                      borderRadius: '16px',
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1, color: alpha('#000', 0.7) }}>
                      Keyboard Shortcuts
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {keyboardShortcuts.map((shortcut) => (
                        <Box
                          key={shortcut.key}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Chip
                            label={shortcut.key}
                            size="small"
                            sx={{
                              fontFamily: 'monospace',
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                            }}
                          />
                          <Typography variant="caption" sx={{ color: alpha('#000', 0.6) }}>
                            {shortcut.description}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content Area */}
            <Paper
              elevation={0}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: {
                  delay: 0.2,
                  duration: 0.5
                }
              }}
              exit={{ 
                opacity: 0,
                transition: {
                  duration: 0.3
                }
              }}
              sx={{
                flex: 1,
                borderRadius: '20px 20px 0 0',
                bgcolor: 'white',
                overflow: 'hidden',
                border: `1px solid ${alpha('#000', 0.1)}`,
                borderBottom: 0,
                boxShadow: `0 -4px 20px ${alpha('#000', 0.1)}`,
                width: '100%',
              }}
            >
              {/* Search Results */}
              {!isChatMode && (
                <Box sx={{ 
                  height: query.trim() ? 'calc(90vh - 180px)' : 'auto',
                  overflowY: 'auto',
                  p: 3,
                }}>
                  {searchResults.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        transition: {
                          delay: 0.5,
                          duration: 0.4
                        }
                      }}
                      exit={{ 
                        opacity: 0,
                        transition: {
                          duration: 0.3
                        }
                      }}
                    >
                      {searchResults.map((group) => (
                        <Box key={group.type} sx={{ mb: 3 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: alpha('#000', 0.87),
                              mb: 2
                            }}
                          >
                            {group.title}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: group.type === 'tools' ? 'row' : 'column',
                            gap: group.type === 'tools' ? 2 : 1.5,
                            flexWrap: group.type === 'tools' ? 'wrap' : 'nowrap'
                          }}>
                            {group.results.map((result) => (
                              <Box
                                key={result.id}
                                onClick={() => onResultClick(result)}
                                sx={{
                                  display: 'flex',
                                  alignItems: group.type === 'tools' ? 'center' : 'flex-start',
                                  gap: 2,
                                  p: 2,
                                  borderRadius: '12px',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  border: '1px solid',
                                  borderColor: alpha('#000', 0.1),
                                  ...(group.type === 'tools' && {
                                    flex: '0 1 auto',
                                    minWidth: '200px',
                                    maxWidth: '300px',
                                  }),
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                    transform: 'translateY(-1px)',
                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                  },
                                }}
                              >
                                {result.icon && (
                                  <Box
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: '10px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: result.color ? alpha(result.color, 0.1) : alpha(theme.palette.primary.main, 0.1),
                                      color: result.color || theme.palette.primary.main,
                                    }}
                                  >
                                    {result.icon}
                                  </Box>
                                )}
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    flexWrap: 'wrap'
                                  }}>
                                    <Typography
                                      sx={{
                                        fontWeight: 600,
                                        color: alpha('#000', 0.87),
                                      }}
                                    >
                                      {result.title}
                                    </Typography>
                                    {result.type === 'data' && (
                                      <>
                                        {result.dataOwner && (
                                          <Chip
                                            label={`Owner: ${result.dataOwner}`}
                                            size="small"
                                            sx={{
                                              height: '20px',
                                              fontSize: '0.75rem',
                                              bgcolor: alpha(theme.palette.info.main, 0.1),
                                              color: theme.palette.info.main,
                                              fontWeight: 500,
                                            }}
                                          />
                                        )}
                                        {result.dataSource && (
                                          <Chip
                                            label={`Source: ${result.dataSource}`}
                                            size="small"
                                            sx={{
                                              height: '20px',
                                              fontSize: '0.75rem',
                                              bgcolor: alpha(theme.palette.success.main, 0.1),
                                              color: theme.palette.success.main,
                                              fontWeight: 500,
                                            }}
                                          />
                                        )}
                                        {result.latency && (
                                          <Chip
                                            label={`Latency: ${result.latency}`}
                                            size="small"
                                            sx={{
                                              height: '20px',
                                              fontSize: '0.75rem',
                                              bgcolor: alpha(theme.palette.warning.main, 0.1),
                                              color: theme.palette.warning.main,
                                              fontWeight: 500,
                                            }}
                                          />
                                        )}
                                      </>
                                    )}
                                  </Box>
                                  {result.type === 'data' && result.path && result.path.length > 0 && (
                                    <Typography
                                      sx={{
                                        fontSize: '0.75rem',
                                        color: alpha('#000', 0.5),
                                        fontFamily: 'monospace',
                                        mt: 0.5,
                                      }}
                                    >
                                      {result.path.join(' / ')}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: 0.5,
                          duration: 0.6,
                          ease: [0.2, 0.1, 0.3, 1],
                          opacity: { duration: 0.5 },
                          y: { 
                            duration: 0.6,
                            ease: [0.2, 0.1, 0.3, 1]
                          }
                        }
                      }}
                      exit={{ 
                        opacity: 0,
                        y: 10,
                        transition: {
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1]
                        }
                      }}
                    >
                      <Box sx={{ 
                        height: query.trim() ? '100%' : '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        color: alpha('#000', 0.5),
                      }}>
                        {query.trim() ? (
                          <>
                            <SearchIcon sx={{ fontSize: 48, opacity: 0.5 }} />
                            <Typography variant="h6">No results found</Typography>
                            <Typography variant="body2">
                              Try different keywords or press Enter to start a chat
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Box sx={{ 
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 1,
                            }}>
                              <SearchIcon sx={{ fontSize: 48, opacity: 0.5 }} />
                              <Typography variant="h6">Start searching</Typography>
                              <Typography variant="body2" textAlign="center">
                                Search for tools, data, or press Enter to start a chat
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              mt: 3,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1,
                            }}>
                              <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                                Try searching for:
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                                {['Data Wizard', 'Customer Segments', 'API Documentation'].map((suggestion) => (
                                  <Chip
                                    key={suggestion}
                                    label={suggestion}
                                    onClick={() => {
                                      setQuery(suggestion);
                                      if (searchInputRef.current) {
                                        searchInputRef.current.value = suggestion;
                                        searchInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
                                      }
                                    }}
                                    sx={{
                                      cursor: 'pointer',
                                      '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          </>
                        )}
                      </Box>
                    </motion.div>
                  )}
                </Box>
              )}

              {/* Chat Interface */}
              {isChatMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    transition: {
                      delay: 0.3,
                      duration: 0.3
                    }
                  }}
                  exit={{ 
                    opacity: 0,
                    transition: {
                      duration: 0.2
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex',
                    height: 'calc(90vh - 180px)',
                  }}>
                    {/* Messages */}
                    <Box
                      ref={chatContainerRef}
                      onScroll={handleScroll}
                      sx={{
                        flex: '1 1 70%',
                        overflowY: 'auto',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                      }}
                    >
                      {chatHistory
                        .filter(message => !message.isSearchQuery)
                        .map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                                gap: 2,
                                alignItems: 'flex-end',
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: message.type === 'user' ? 'primary.main' : 'secondary.main',
                                  boxShadow: `0 2px 8px ${alpha('#000', 0.1)}`,
                                }}
                              >
                                {message.type === 'user' ? 'U' : 'A'}
                              </Avatar>
                              <Box sx={{ maxWidth: '70%' }}>
                                <Paper
                                  elevation={0}
                                  sx={{
                                    p: 2,
                                    borderRadius: '16px',
                                    bgcolor: message.type === 'user' 
                                      ? alpha(theme.palette.primary.main, 0.1)
                                      : alpha(theme.palette.grey[100], 0.8),
                                    color: message.type === 'user'
                                      ? theme.palette.primary.main
                                      : theme.palette.text.primary,
                                    border: '1px solid',
                                    borderColor: message.type === 'user'
                                      ? alpha(theme.palette.primary.main, 0.2)
                                      : alpha('#000', 0.1),
                                  }}
                                >
                                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {message.content}
                                  </Typography>
                                </Paper>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    mt: 0.5,
                                    display: 'block',
                                    textAlign: message.type === 'user' ? 'right' : 'left',
                                    color: alpha('#000', 0.5),
                                  }}
                                >
                                  {formatTimestamp(message.timestamp)}
                                </Typography>
                              </Box>
                            </Box>
                          </motion.div>
                        ))}
                    </Box>

                    {/* Chat History Sidebar */}
                    <Box sx={{ 
                      flex: '0 0 30%',
                      borderLeft: `1px solid ${alpha('#000', 0.1)}`,
                      bgcolor: alpha('#000', 0.02),
                      display: { xs: 'none', md: 'flex' },
                      flexDirection: 'column',
                    }}>
                      <Box sx={{ 
                        p: 2,
                        borderBottom: `1px solid ${alpha('#000', 0.1)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HistoryIcon sx={{ fontSize: 20, color: alpha('#000', 0.5) }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Chat History
                          </Typography>
                        </Box>
                        <Tooltip title="Clear All">
                          <IconButton size="small" onClick={clearHistory}>
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Box sx={{ p: 2, overflowY: 'auto' }}>
                        {[
                          { id: 'h1', title: 'Data Schema Questions', date: '2 hours ago', messageCount: 4 },
                          { id: 'h2', title: 'API Integration Help', date: '5 hours ago', messageCount: 6 },
                          { id: 'h3', title: 'Workflow Automation', date: 'Yesterday', messageCount: 3 },
                        ].map((history) => (
                          <Paper
                            key={history.id}
                            elevation={0}
                            sx={{
                              p: 2,
                              mb: 1,
                              borderRadius: '12px',
                              cursor: 'pointer',
                              border: '1px solid',
                              borderColor: alpha('#000', 0.1),
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                transform: 'translateY(-1px)',
                              },
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                              {history.title}
                            </Typography>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                            }}>
                              <Typography variant="caption" sx={{ color: alpha('#000', 0.5) }}>
                                {history.date}
                              </Typography>
                              <Chip
                                label={`${history.messageCount} msgs`}
                                size="small"
                                sx={{
                                  height: '20px',
                                  fontSize: '0.75rem',
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main,
                                }}
                              />
                            </Box>
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              )}

              {/* Input Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: {
                    delay: 0.3,
                    duration: 0.4
                  }
                }}
                exit={{ 
                  opacity: 0,
                  transition: {
                    duration: 0.3
                  }
                }}
              >
                <Box sx={{ p: 2, borderTop: `1px solid ${alpha('#000', 0.1)}`, bgcolor: 'white' }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    inputRef={searchInputRef}
                    value={query}
                    onChange={handleSearch}
                    onKeyPress={handleKeyPress}
                    placeholder={isChatMode ? "Type your message..." : "Search or press Enter to chat..."}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {isChatMode ? (
                            <ChatIcon sx={{ color: theme.palette.primary.main }} />
                          ) : (
                            <SearchIcon sx={{ color: alpha('#000', 0.5) }} />
                          )}
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {isLoading ? (
                              <CircularProgress size={24} />
                            ) : (
                              isChatMode && query.trim() && (
                                <IconButton
                                  color="primary"
                                  onClick={() => handleKeyPress({ key: 'Enter', shiftKey: false, preventDefault: () => {} } as any)}
                                >
                                  <SendIcon />
                                </IconButton>
                              )
                            )}
                            <Chip
                              label="⌘K"
                              size="small"
                              sx={{
                                height: '24px',
                                bgcolor: alpha('#000', 0.05),
                                color: alpha('#000', 0.6),
                                fontFamily: 'monospace',
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: alpha('#000', 0.02),
                        '&:hover': {
                          bgcolor: alpha('#000', 0.03),
                        },
                        '&.Mui-focused': {
                          bgcolor: '#fff',
                        },
                      },
                    }}
                  />
                </Box>
              </motion.div>
            </Paper>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnifiedSearch; 