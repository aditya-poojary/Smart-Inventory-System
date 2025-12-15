import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./style/home.css";
import greenDot from "../public/assets/green-dot.svg";
import grayDot from "../public/assets/grey-dot.svg";
import DEFAULT_NO_IMAGE from "../public/assets/default_icon_listing.png";
import loaderGif from "../public/assets/loader.gif";
import axios from "axios";
import urlJoin from "url-join";

const EXAMPLE_MAIN_URL = window.location.origin;

export const Home = () => {
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
    webhooksActive: 0,
  });

  const DOC_URL_PATH =
    "/help/docs/sdk/latest/platform/company/catalog/#getProducts";
  const DOC_APP_URL_PATH =
    "/help/docs/sdk/latest/platform/application/catalog#getAppProducts";
  const { application_id, company_id } = useParams();
  const documentationUrl = "https://api.fynd.com";

  useEffect(() => {
    loadDashboardData();
  }, [application_id]);

  const loadDashboardData = async () => {
    setPageLoading(true);
    try {
      await Promise.all([
        isApplicationLaunch() ? fetchApplicationProducts() : fetchProducts(),
        fetchInventoryData(),
        fetchWebhookStatus(),
      ]);
      calculateStats();
    } catch (e) {
      console.error("Error loading dashboard:", e);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        urlJoin(EXAMPLE_MAIN_URL, "/api/products"),
        {
          headers: {
            "x-company-id": company_id,
          },
        }
      );
      setProductList(data.items || []);
      return data.items;
    } catch (e) {
      console.error("Error fetching products:", e);
      return [];
    }
  };

  const fetchApplicationProducts = async () => {
    try {
      const { data } = await axios.get(
        urlJoin(
          EXAMPLE_MAIN_URL,
          `/api/products/application/${application_id}`
        ),
        {
          headers: {
            "x-company-id": company_id,
          },
        }
      );
      setProductList(data.items || []);
      return data.items;
    } catch (e) {
      console.error("Error fetching application products:", e);
      return [];
    }
  };

  const fetchInventoryData = async () => {
    try {
      const { data } = await axios.get(
        urlJoin(EXAMPLE_MAIN_URL, "/api/inventory"),
        {
          headers: {
            "x-company-id": company_id,
          },
        }
      );
      setInventoryData(data.items || []);
      return data.items;
    } catch (e) {
      console.error("Error fetching inventory:", e);
      return [];
    }
  };

  const fetchWebhookStatus = async () => {
    try {
      const { data } = await axios.get(
        urlJoin(EXAMPLE_MAIN_URL, "/api/webhooks/status"),
        {
          headers: {
            "x-company-id": company_id,
          },
        }
      );
      setWebhookStatus(data);
      return data;
    } catch (e) {
      console.error("Error fetching webhook status:", e);
      return { configured: false, events: [] };
    }
  };

  const calculateStats = () => {
    const lowStock = inventoryData.filter((item) => item.quantity < 10).length;
    setStats({
      totalProducts: productList.length,
      lowStockItems: lowStock,
      recentOrders: 0, // TODO: Fetch from orders API
      webhooksActive: webhookStatus.events?.length || 0,
    });
  };

  const productProfileImage = (media) => {
    if (!media || !media.length) {
      return DEFAULT_NO_IMAGE;
    }
    const profileImg = media.find((m) => m.type === "image");
    return profileImg?.url || DEFAULT_NO_IMAGE;
  };

  const getDocumentPageLink = () => {
    return documentationUrl
      .replace("api", "partners")
      .concat(isApplicationLaunch() ? DOC_APP_URL_PATH : DOC_URL_PATH);
  };

  const isApplicationLaunch = () => !!application_id;

  return (
    <>
      {pageLoading ? (
        <div className="loader" data-testid="loader">
          <img src={loaderGif} alt="loader GIF" />
        </div>
      ) : (
        <div className="products-container">
          <div className="title">
            This is an example extension home page user interface.
          </div>

          <div className="section">
            <div className="heading">
              <span>
                Example{" "}
                {isApplicationLaunch() ? "Application API" : "Platform API"}
              </span>{" "}
              :
              <a
                href={getDocumentPageLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                {isApplicationLaunch() ? "getAppProducts" : "getProducts"}
              </a>
            </div>
            <div className="description">
              This is an illustrative Platform API call to fetch the list of
              products in this company. Check your extension folder’s
              'server.js' file to know how to call Platform API and start
              calling API you require.
            </div>
          </div>

          <div>
            {productList.map((product, index) => (
              <div
                className="product-list-container flex-row"
                key={`product-${product.name}-${index}`}
              >
                <img
                  className="mr-r-12"
                  src={product.is_active ? greenDot : grayDot}
                  alt="status"
                />
                <div className="card-avatar mr-r-12">
                  <img
                    src={productProfileImage(product.media)}
                    alt={product.name}
                  />
                </div>
                <div className="flex-column">
                  <div className="flex-row">
                    <div
                      className="product-name"
                      data-testid={`product-name-${product.id}`}
                    >
                      {product.name}
                    </div>
                    <div className="product-item-code">|</div>
                    {product.item_code && (
                      <span className="product-item-code">
                        Item Code:
                        <span
                          className="cl-RoyalBlue"
                          data-testid={`product-item-code-${product.id}`}
                        >
                          {product.item_code}
                        </span>
                      </span>
                    )}
                  </div>
                  {product.brand && (
                    <div
                      className="product-brand-name"
                      data-testid={`product-brand-name-${product.id}`}
                    >
                      {product.brand.name}
                    </div>
                  )}
                  {product.category_slug && (
                    <div
                      className="product-category"
                      data-testid={`product-category-slug-${product.id}`}
                    >
                      Category: <span>{product.category_slug}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
