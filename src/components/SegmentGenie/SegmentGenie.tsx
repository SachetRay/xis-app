import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  alpha,
  useTheme,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  Tooltip,
  Divider,
  useMediaQuery,
  Fade,
  CircularProgress,
  Badge,
  Menu,
  MenuItem,
  ListItemButton,
  Card,
  CardContent,
  CardActionArea,
  LinearProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  AutoFixHigh as AutoFixHighIcon,
  Group as GroupIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CompareArrows as CompareArrowsIcon,
  Analytics as AnalyticsIcon,
  Help as HelpIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  ContentCopy as ContentCopyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Chat as ChatIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    query?: string;
    profileCount?: number;
    recommendations?: string[];
    overlaps?: Array<{
      name: string;
      percentage: number;
    }>;
  };
}

interface Segment {
  id: string;
  name: string;
  query: string;
  profileCount: number;
  lastModified: Date;
  status: 'active' | 'draft' | 'archived';
  isFavorite?: boolean;
}

const SegmentGenie: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [segments, setSegments] = useState<Segment[]>([
    {
      id: '1',
      name: 'High-Value Customers',
      query: 'totalSpent > 1000 AND lastPurchaseDate within last 90 days',
      profileCount: 12458,
      lastModified: new Date('2023-05-15'),
      status: 'active',
      isFavorite: true,
    },
    {
      id: '2',
      name: 'Abandoned Cart Users',
      query: 'cartItems > 0 AND lastActivityDate within last 7 days AND purchaseCount = 0',
      profileCount: 3452,
      lastModified: new Date('2023-06-02'),
      status: 'active',
    },
    {
      id: '3',
      name: 'Inactive Subscribers',
      query: 'subscriptionStatus = "active" AND lastLoginDate < 90 days ago',
      profileCount: 8765,
      lastModified: new Date('2023-05-28'),
      status: 'draft',
    },
  ]);
  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      title: 'High-value customers in US',
      date: 'Today, 2:30 PM',
      count: 12,
      firstLetter: 'H'
    },
    {
      id: '2',
      title: 'Users who abandoned cart',
      date: 'Today, 11:15 AM',
      count: 8,
      firstLetter: 'U'
    },
    {
      id: '3',
      title: 'Inactive subscribers',
      date: 'Yesterday, 4:45 PM',
      count: 15,
      firstLetter: 'I'
    },
    {
      id: '4',
      title: 'Enterprise customers',
      date: 'Yesterday, 10:20 AM',
      count: 6,
      firstLetter: 'E'
    },
    {
      id: '5',
      title: 'Users who viewed pricing page',
      date: 'Jun 15, 3:10 PM',
      count: 9,
      firstLetter: 'U'
    }
  ]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'segments'>('history');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: "I've analyzed your request. Here's what I found:",
        timestamp: new Date(),
        metadata: {
          query: "signupDate within last 30 days AND pageViews (URL = pricing) > 1",
          profileCount: 6589,
          recommendations: [
            "Consider adding a loyalty tier filter for more precise targeting",
            "You might want to exclude users who already purchased"
          ],
          overlaps: [
            { name: "Recent Signups", percentage: 45 },
            { name: "Price Page Visitors", percentage: 32 }
          ]
        }
      };

      setMessages(prev => [...prev, systemMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'user':
        return <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>U</Avatar>;
      case 'system':
        return <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.info.main, 0.1) }}>S</Avatar>;
    }
  };

  const getMessageColor = (type: Message['type']) => {
    switch (type) {
      case 'user':
        return alpha(theme.palette.primary.main, 0.05);
      case 'system':
        return alpha(theme.palette.info.main, 0.05);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, segmentId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedSegment(segmentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSegment(null);
  };

  const toggleFavorite = (segmentId: string) => {
    setSegments(prev => 
      prev.map(segment => 
        segment.id === segmentId 
          ? { ...segment, isFavorite: !segment.isFavorite } 
          : segment
      )
    );
  };

  const getStatusColor = (status: Segment['status']) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'draft':
        return theme.palette.warning.main;
      case 'archived':
        return theme.palette.text.secondary;
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      p: { xs: '12px', sm: '16px', md: '20px' },
      gap: { xs: 1, sm: 2, md: 2 },
      bgcolor: '#ffffff',
      maxWidth: '1400px',
      mx: 'auto',
    }}>
      {/* Welcome Section */}
      <Box sx={{ 
        mb: { xs: 0.5, sm: 1 },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        pb: 1.5,
        borderBottom: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.06)'
      }}>
        <Box>
          <Typography sx={{ 
            fontSize: { xs: '22px', sm: '24px' },
            fontWeight: 600,
            color: 'rgba(0, 0, 0, 0.87)',
            letterSpacing: '-0.01em',
            mb: 0.5,
            background: 'linear-gradient(45deg, #0066cc 30%, #3384d7 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            SegmentGenie
          </Typography>
          <Typography sx={{ 
            fontSize: '13px',
            color: 'rgba(0, 0, 0, 0.6)',
            letterSpacing: '0.01em'
          }}>
            Create and optimize audience segments using natural language
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Analytics">
            <IconButton sx={{ color: alpha('#000', 0.6) }}>
              <AnalyticsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Help & Documentation">
            <IconButton sx={{ color: alpha('#000', 0.6) }}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {/* History Panel - Now on the left */}
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: alpha('#000', 0.08),
              overflow: 'hidden',
              bgcolor: alpha('#fff', 0.8),
            }}
          >
            {/* Tabs */}
            <Box sx={{ 
              display: 'flex', 
              borderBottom: '1px solid', 
              borderColor: alpha('#000', 0.08),
            }}>
              <Button
                variant="text"
                startIcon={<ChatIcon />}
                onClick={() => setActiveTab('history')}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 0,
                  color: activeTab === 'history' ? theme.palette.primary.main : alpha('#000', 0.6),
                  borderBottom: activeTab === 'history' ? `2px solid ${theme.palette.primary.main}` : 'none',
                  '&:hover': {
                    bgcolor: activeTab === 'history' ? alpha(theme.palette.primary.main, 0.05) : alpha('#000', 0.03),
                  }
                }}
              >
                History
              </Button>
              <Button
                variant="text"
                startIcon={<GroupIcon />}
                onClick={() => setActiveTab('segments')}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 0,
                  color: activeTab === 'segments' ? theme.palette.primary.main : alpha('#000', 0.6),
                  borderBottom: activeTab === 'segments' ? `2px solid ${theme.palette.primary.main}` : 'none',
                  '&:hover': {
                    bgcolor: activeTab === 'segments' ? alpha(theme.palette.primary.main, 0.05) : alpha('#000', 0.03),
                  }
                }}
              >
                Segments
              </Button>
            </Box>

            {/* History Tab */}
            {activeTab === 'history' && (
              <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 1.5,
                }}>
                  <Typography sx={{ 
                    fontSize: '15px',
                    fontWeight: 600,
                    color: alpha('#000', 0.87),
                  }}>
                    Recent Conversations
                  </Typography>
                  <IconButton size="small" sx={{ color: alpha('#000', 0.6) }}>
                    <SearchIcon />
                  </IconButton>
                </Box>
                <List sx={{ p: 0, flex: 1, overflow: 'auto' }}>
                  {chatHistory.map((chat) => (
                    <ListItem
                      key={chat.id}
                      sx={{
                        borderRadius: '8px',
                        mb: 0.75,
                        p: 0,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        }
                      }}
                    >
                      <ListItemButton
                        sx={{
                          borderRadius: '8px',
                          py: 1.25,
                        }}
                      >
                        <ListItemIcon>
                          <Avatar sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            width: 32,
                            height: 32,
                            fontSize: '14px',
                          }}>
                            {chat.firstLetter}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography sx={{ 
                              fontWeight: 500,
                              fontSize: '14px',
                              color: alpha('#000', 0.87),
                            }}>
                              {chat.title}
                            </Typography>
                          }
                          secondary={
                            <Typography sx={{ 
                              fontSize: '12px',
                              color: alpha('#000', 0.6),
                            }}>
                              {chat.date} • {chat.count} messages
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Segments Tab */}
            {activeTab === 'segments' && (
              <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 1.5,
                }}>
                  <Typography sx={{ 
                    fontSize: '15px',
                    fontWeight: 600,
                    color: alpha('#000', 0.87),
                  }}>
                    Recent Segments
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    size="small"
                    sx={{
                      textTransform: 'none',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                  >
                    New
                  </Button>
                </Box>
                <List sx={{ p: 0, flex: 1, overflow: 'auto' }}>
                  {segments.map((segment) => (
                    <ListItem
                      key={segment.id}
                      sx={{
                        borderRadius: '8px',
                        mb: 0.75,
                        p: 0,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        }
                      }}
                    >
                      <ListItemButton
                        sx={{
                          borderRadius: '8px',
                          py: 1.25,
                        }}
                      >
                        <ListItemIcon>
                          <GroupIcon sx={{ color: alpha(theme.palette.primary.main, 0.7) }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ 
                                fontWeight: 500,
                                fontSize: '14px',
                                color: alpha('#000', 0.87),
                              }}>
                                {segment.name}
                              </Typography>
                              {segment.isFavorite && (
                                <StarIcon sx={{ 
                                  fontSize: '16px',
                                  color: theme.palette.warning.main,
                                }} />
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography sx={{ 
                              fontSize: '12px',
                              color: alpha('#000', 0.6),
                            }}>
                              {segment.profileCount.toLocaleString()} profiles • {segment.status}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: alpha('#000', 0.08),
              overflow: 'hidden',
              bgcolor: alpha('#fff', 0.8),
            }}
          >
            {/* Messages Container */}
            <Box sx={{ 
              flex: 1, 
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: alpha('#000', 0.03),
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: alpha('#000', 0.1),
                borderRadius: '10px',
                '&:hover': {
                  background: alpha('#000', 0.2),
                },
              },
            }}>
              {messages.length === 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  py: 3,
                  opacity: 0.7,
                }}>
                  <Box sx={{ 
                    width: 70, 
                    height: 70, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    mb: 2,
                  }}>
                    <AutoFixHighIcon sx={{ fontSize: 36, color: theme.palette.primary.main }} />
                  </Box>
                  <Typography sx={{ 
                    fontSize: '16px',
                    fontWeight: 600,
                    color: alpha('#000', 0.8),
                    textAlign: 'center',
                    maxWidth: '80%',
                    mb: 1,
                  }}>
                    Ask me to create a segment for you
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '13px',
                    color: alpha('#000', 0.6),
                    textAlign: 'center',
                    maxWidth: '80%',
                    mb: 2,
                  }}>
                    I can help you build audience segments using natural language
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1, width: '100%', maxWidth: '400px' }}>
                    <Button
                      variant="outlined"
                      startIcon={<GroupIcon />}
                      onClick={() => setInputValue("Find users who signed up in the last 30 days and visited the pricing page")}
                      sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        borderRadius: '10px',
                        textTransform: 'none',
                        borderColor: alpha('#000', 0.08),
                        color: alpha('#000', 0.7),
                        py: 1.25,
                        '&:hover': {
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        }
                      }}
                    >
                      Find users who signed up in the last 30 days and visited the pricing page
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<GroupIcon />}
                      onClick={() => setInputValue("Show me customers who have spent more than $1000 in the last 90 days")}
                      sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        borderRadius: '10px',
                        textTransform: 'none',
                        borderColor: alpha('#000', 0.08),
                        color: alpha('#000', 0.7),
                        py: 1.25,
                        '&:hover': {
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        }
                      }}
                    >
                      Show me customers who have spent more than $1000 in the last 90 days
                    </Button>
                  </Box>
                </Box>
              )}
              {messages.map((message) => (
                <Fade in key={message.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'flex-start',
                      maxWidth: '85%',
                      ml: message.type === 'user' ? 'auto' : 0,
                      mr: message.type === 'user' ? 0 : 'auto',
                    }}
                  >
                    {message.type === 'system' && getMessageIcon(message.type)}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '10px',
                          bgcolor: getMessageColor(message.type),
                          border: '1px solid',
                          borderColor: message.type === 'user' 
                            ? alpha(theme.palette.primary.main, 0.1) 
                            : alpha(theme.palette.info.main, 0.1),
                        }}
                      >
                        <Typography sx={{ 
                          fontSize: '13px',
                          lineHeight: 1.5,
                          color: alpha('#000', 0.87),
                        }}>
                          {message.content}
                        </Typography>
                      </Box>
                      {message.metadata && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {message.metadata.query && (
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: '8px',
                                bgcolor: alpha('#fff', 0.7),
                                border: '1px solid',
                                borderColor: alpha(theme.palette.info.main, 0.2),
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '4px',
                                  height: '100%',
                                  bgcolor: theme.palette.info.main,
                                }
                              }}
                            >
                              <Typography sx={{ 
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                color: alpha('#000', 0.87),
                              }}>
                                {message.metadata.query}
                              </Typography>
                              <IconButton 
                                size="small" 
                                sx={{ 
                                  position: 'absolute', 
                                  top: 4, 
                                  right: 4,
                                  color: alpha('#000', 0.4),
                                  '&:hover': {
                                    color: theme.palette.primary.main,
                                  }
                                }}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                          {message.metadata.profileCount && (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1,
                              p: 1.25,
                              borderRadius: '8px',
                              bgcolor: alpha(theme.palette.success.main, 0.05),
                              border: '1px solid',
                              borderColor: alpha(theme.palette.success.main, 0.1),
                            }}>
                              <GroupIcon sx={{ fontSize: 14, color: theme.palette.success.main }} />
                              <Typography sx={{ 
                                fontSize: '12px',
                                color: alpha('#000', 0.7),
                                fontWeight: 500,
                              }}>
                                Estimated audience size: <span style={{ color: theme.palette.success.main, fontWeight: 600 }}>{message.metadata.profileCount.toLocaleString()}</span> profiles
                              </Typography>
                            </Box>
                          )}
                          {message.metadata.recommendations && (
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: 0.75,
                              p: 1.25,
                              borderRadius: '8px',
                              bgcolor: alpha(theme.palette.warning.main, 0.05),
                              border: '1px solid',
                              borderColor: alpha(theme.palette.warning.main, 0.1),
                            }}>
                              <Typography sx={{ 
                                fontSize: '12px',
                                fontWeight: 600,
                                color: theme.palette.warning.main,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}>
                                <InfoIcon sx={{ fontSize: 14 }} />
                                Recommendations
                              </Typography>
                              {message.metadata.recommendations.map((rec, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography sx={{ 
                                    fontSize: '12px',
                                    color: alpha('#000', 0.7),
                                  }}>
                                    {rec}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                          {message.metadata.overlaps && (
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: 0.75,
                              p: 1.25,
                              borderRadius: '8px',
                              bgcolor: alpha(theme.palette.info.main, 0.05),
                              border: '1px solid',
                              borderColor: alpha(theme.palette.info.main, 0.1),
                            }}>
                              <Typography sx={{ 
                                fontSize: '12px',
                                fontWeight: 600,
                                color: theme.palette.info.main,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}>
                                <CompareArrowsIcon sx={{ fontSize: 14 }} />
                                Overlapping Segments
                              </Typography>
                              {message.metadata.overlaps.map((overlap, index) => (
                                <Box key={index} sx={{ 
                                  display: 'flex', 
                                  flexDirection: 'column',
                                  gap: 0.5,
                                }}>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}>
                                    <Typography sx={{ 
                                      fontSize: '12px',
                                      color: alpha('#000', 0.7),
                                    }}>
                                      {overlap.name}
                                    </Typography>
                                    <Typography sx={{ 
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      color: theme.palette.info.main,
                                    }}>
                                      {overlap.percentage}%
                                    </Typography>
                                  </Box>
                                  <Box sx={{ 
                                    height: '3px', 
                                    width: '100%', 
                                    bgcolor: alpha('#000', 0.05),
                                    borderRadius: '2px',
                                    overflow: 'hidden',
                                  }}>
                                    <Box sx={{ 
                                      height: '100%', 
                                      width: `${overlap.percentage}%`, 
                                      bgcolor: theme.palette.info.main,
                                      borderRadius: '2px',
                                    }} />
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                    {message.type === 'user' && getMessageIcon(message.type)}
                  </Box>
                </Fade>
              ))}
              {isProcessing && (
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  {getMessageIcon('system')}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    p: 1.25,
                    borderRadius: '8px',
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.info.main, 0.1),
                  }}>
                    <CircularProgress size={14} sx={{ color: theme.palette.info.main }} />
                    <Typography sx={{ 
                      fontSize: '13px',
                      color: alpha('#000', 0.7),
                    }}>
                      Processing your request...
                    </Typography>
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{ 
              p: 1.5,
              borderTop: '1px solid',
              borderColor: alpha('#000', 0.08),
              bgcolor: alpha('#fff', 0.7),
            }}>
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                alignItems: 'center',
              }}>
                <TextField
                  fullWidth
                  placeholder="Describe your audience segment in natural language..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      bgcolor: alpha('#fff', 0.8),
                      '& fieldset': {
                        borderColor: alpha('#000', 0.08),
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '13px',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AutoFixHighIcon sx={{ color: alpha(theme.palette.primary.main, 0.5) }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  sx={{
                    color: inputValue.trim() ? theme.palette.primary.main : alpha('#000', 0.3),
                    bgcolor: inputValue.trim() ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      bgcolor: inputValue.trim() ? alpha(theme.palette.primary.main, 0.2) : alpha('#000', 0.05),
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Segment Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            borderRadius: '8px',
            border: '1px solid',
            borderColor: alpha('#000', 0.08),
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            minWidth: 180,
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedSegment) {
            toggleFavorite(selectedSegment);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            {segments.find(s => s.id === selectedSegment)?.isFavorite 
              ? <StarIcon fontSize="small" sx={{ color: theme.palette.warning.main }} /> 
              : <StarBorderIcon fontSize="small" />
            }
          </ListItemIcon>
          <ListItemText>
            {segments.find(s => s.id === selectedSegment)?.isFavorite 
              ? 'Remove from Favorites' 
              : 'Add to Favorites'
            }
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SegmentGenie; 