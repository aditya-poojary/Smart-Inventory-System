import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import urlJoin from "url-join";
import DEFAULT_NO_IMAGE from "../public/assets/default_icon_listing.png";
import loaderGif from "../public/assets/loader.gif";
import greenDot from "../public/assets/green-dot.svg";
import grayDot from "../public/assets/grey-dot.svg";
import "./style/smart-inventory.css";

const EXAMPLE_MAIN_URL = window.location.origin;

export const SmartInventory = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [webhookStatus, setWebhookStatus] = useState({
    configured: false,
    events: [],
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    recentOrders: 0,
    webhooksActive: 3,
  });

  const { application_id, company_id } = useParams();

  useEffect(() => {
    loadDashboardData();
  }, [application_id]);

  const loadDashboardData = async () => {
    setPageLoading(true);
    try {
      await fetchProducts();
      calculateStats();
    } catch (e) {
      console.error("Error loading dashboard:", e);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const endpoint = application_id
        ? urlJoin(
            EXAMPLE_MAIN_URL,
            `/api/products/application/${application_id}`
          )
        : urlJoin(EXAMPLE_MAIN_URL, "/api/products");

      const { data } = await axios.get(endpoint, {
        headers: { "x-company-id": company_id },
      });
      setProductList(data.items || []);
      return data.items;
    } catch (e) {
      console.error("Error fetching products:", e);
      return [];
    }
  };

  const calculateStats = () => {
    const lowStock = inventoryData.filter((item) => item.quantity < 10).length;
    setStats({
      totalProducts: productList.length,
      lowStockItems: lowStock,
      recentOrders: 0,
      webhooksActive: 3,
    });
  };

  const productProfileImage = (media) => {
    if (!media || !media.length) return DEFAULT_NO_IMAGE;
    const profileImg = media.find((m) => m.type === "image");
    return profileImg?.url || DEFAULT_NO_IMAGE;
  };

  return (
    <>
      {pageLoading ? (
        <div className="loader">
          <img src={loaderGif} alt="loading" />
        </div>
      ) : (
        <div className="smart-inventory-dashboard">
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-content">
              <h1>🎯 Smart Inventory System</h1>
              <p>AI-Powered Demand Forecasting & Inventory Management</p>
            </div>
            <div className="header-actions">
              <button className="btn-refresh" onClick={loadDashboardData}>
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>{productList.length}</h3>
                <p>Total Products</p>
              </div>
            </div>
            <div className="stat-card orange">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <h3>{stats.lowStockItems}</h3>
                <p>Low Stock Alerts</p>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon">🛒</div>
              <div className="stat-content">
                <h3>{stats.recentOrders}</h3>
                <p>Recent Orders</p>
              </div>
            </div>
            <div className="stat-card purple">
              <div className="stat-icon">🔔</div>
              <div className="stat-content">
                <h3>{stats.webhooksActive}</h3>
                <p>Active Webhooks</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`tab-button ${
                activeTab === "products" ? "active" : ""
              }`}
              onClick={() => setActiveTab("products")}
            >
              Products ({productList.length})
            </button>
            <button
              className={`tab-button ${
                activeTab === "inventory" ? "active" : ""
              }`}
              onClick={() => setActiveTab("inventory")}
            >
              Inventory
            </button>
            <button
              className={`tab-button ${
                activeTab === "webhooks" ? "active" : ""
              }`}
              onClick={() => setActiveTab("webhooks")}
            >
              Webhooks
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="tab-content">
              <div className="section-card">
                <h2>📊 Quick Overview</h2>
                <div className="overview-grid">
                  <div className="overview-item">
                    <h4>Webhook Status</h4>
                    <div className="status-badge green">
                      <span className="dot"></span> Configured
                    </div>
                  </div>
                  <div className="overview-item">
                    <h4>Sync Status</h4>
                    <div className="status-badge green">
                      <span className="dot"></span> Active
                    </div>
                  </div>
                  <div className="overview-item">
                    <h4>Last Sync</h4>
                    <p className="sync-time">{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="section-card">
                <h2>🔗 Integration Guide</h2>
                <div className="integration-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Configure Webhooks</h4>
                      <p>
                        Set up product, inventory, and order webhooks to sync
                        with Boltic
                      </p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Populate Products</h4>
                      <p>Add products to Fynd Platform to start syncing</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Monitor Inventory</h4>
                      <p>Track stock levels and receive low stock alerts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="tab-content">
              <div className="section-card">
                <div className="section-header">
                  <h2>📦 Product Catalog</h2>
                  <a
                    href={`https://platform.fynd.com/company/${company_id}/products/list`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    + Add Products
                  </a>
                </div>

                {productList.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>No products found</h3>
                    <p>Add products to get started with inventory management</p>
                    <a
                      href={`https://platform.fynd.com/company/${company_id}/products/list`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary-large"
                    >
                      Add Your First Product
                    </a>
                  </div>
                ) : (
                  <div className="products-grid">
                    {productList.map((product, index) => (
                      <div key={index} className="product-card">
                        <img
                          src={productProfileImage(product.media)}
                          alt={product.name}
                          className="product-image"
                        />
                        <div className="product-info">
                          <h3>{product.name}</h3>
                          <p className="brand">
                            {product.brand?.name || "No Brand"}
                          </p>
                          {product.item_code && (
                            <p className="item-code">
                              SKU: {product.item_code}
                            </p>
                          )}
                          <div className="product-meta">
                            <span className="category">
                              {product.category_slug || "Uncategorized"}
                            </span>
                            <span
                              className={`status ${
                                product.is_active ? "active" : "inactive"
                              }`}
                            >
                              <img
                                src={product.is_active ? greenDot : grayDot}
                                alt="status"
                              />
                              {product.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="tab-content">
              <div className="section-card">
                <h2>📊 Inventory Levels</h2>
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3>Inventory tracking coming soon</h3>
                  <p>
                    Once you start receiving orders, inventory data will appear
                    here
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Webhooks Tab */}
          {activeTab === "webhooks" && (
            <div className="tab-content">
              <div className="section-card">
                <h2>🔔 Webhook Configuration</h2>
                <div className="webhook-info">
                  <p className="webhook-description">
                    Configure webhooks to automatically sync data with Boltic
                    platform.
                  </p>

                  <div className="webhook-events">
                    <h3>Supported Events:</h3>
                    <div className="event-list">
                      <div className="event-item">
                        <span className="event-icon">📦</span>
                        <div>
                          <h4>company/product/create</h4>
                          <p>Triggered when a new product is created</p>
                        </div>
                      </div>
                      <div className="event-item">
                        <span className="event-icon">📊</span>
                        <div>
                          <h4>company/inventory/update</h4>
                          <p>Triggered when inventory levels change</p>
                        </div>
                      </div>
                      <div className="event-item">
                        <span className="event-icon">🛒</span>
                        <div>
                          <h4>application/order/placed</h4>
                          <p>Triggered when a new order is placed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="webhook-endpoint">
                    <h3>Webhook Endpoint:</h3>
                    <div className="endpoint-box">
                      <code>{EXAMPLE_MAIN_URL}/api/v1/webhooks</code>
                      <button
                        className="copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${EXAMPLE_MAIN_URL}/api/v1/webhooks`
                          );
                          alert("Copied to clipboard!");
                        }}
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>

                  <div className="webhook-docs">
                    <a
                      href="https://docs.fynd.com/partners/commerce/webhooks/overview"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      📚 View Webhook Documentation
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SmartInventory;
