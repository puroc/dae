package com.example.data.analysis;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.*;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

/**
 * Created by puroc on 2016/11/16.
 */
@RestController
public class ProxyController {

    private static PoolingHttpClientConnectionManager cm;

    private static final String APPLICATION_JSON = "application/json";

    private static final String CONTENT_TYPE_TEXT_JSON = "text/json";

    private final String HTTP_PREFIX = "http://192.168.99.129:9999";

    static {
        cm = new PoolingHttpClientConnectionManager();
        cm.setMaxTotal(50);// 整个连接池最大连接数
        cm.setDefaultMaxPerRoute(5);// 每路由最大连接数，默认值是2
    }

    @RequestMapping(value = "/rest/**", method = RequestMethod.GET)
    public String doGet(HttpServletRequest request) {
        String result = null;
        try {
            final URI uri = replaceUri(request);
            HttpGet get = new HttpGet();
            get.setURI(uri);
            setHeaders(request, get);
            result = getResult(get);
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return result;
    }

    private URI replaceUri(HttpServletRequest request) throws URISyntaxException {
        return new URI(request.getRequestURI().replace("/rest", HTTP_PREFIX));
    }


    @RequestMapping(value = "/rest/**", method = RequestMethod.POST)
    public String doPost(HttpServletRequest request, @RequestBody String body) {
        String result = null;
        try {
            final URI uri = replaceUri(request);
            HttpPost post = new HttpPost();
            post.setURI(uri);
//            post.addHeader("Content-type","application/json; charset=utf-8");
//            post.setHeader("Accept", "application/json");
            post.setEntity(new StringEntity(body, Charset.forName("UTF-8")));
            result = getResult(post);
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return result;
    }

    @RequestMapping(value = "/rest/**", method = RequestMethod.PUT)
    public String doPut(HttpServletRequest request, @RequestBody String body) {
        String result = null;
        try {
            final URI uri = replaceUri(request);
            HttpPut put = new HttpPut();
            put.setURI(uri);
            setHeaders(request, put);
            put.setEntity(new StringEntity(body, Charset.forName("UTF-8")));
            result = getResult(put);
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return result;
    }

    @RequestMapping(value = "/rest/**", method = RequestMethod.DELETE)
    public String doDelete(HttpServletRequest request, HttpServletResponse response) {
        String result = null;
        try {
            final URI uri = replaceUri(request);
            HttpDelete delete = new HttpDelete();
            delete.setURI(uri);
            setHeaders(request, delete);
            result = getResult(delete);
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return result;
    }

    private void setHeaders(HttpServletRequest request, HttpRequestBase rb) {
        final List<Header> headers = getHeaderList(request);
        for (Header header : headers) {
            rb.setHeader(header);
        }
    }

    private List<Header> getHeaderList(HttpServletRequest request) {
        List<Header> list = new ArrayList<Header>();
        final Enumeration<String> names = request.getHeaderNames();
        if (names.hasMoreElements()) {
            final String key = names.nextElement();
            final String value = request.getHeader(key);
            list.add(new BasicHeader(key, value));
        }
        return list;
    }

    private static CloseableHttpClient getHttpClient() {
        return HttpClients.custom().setConnectionManager(cm).build();
    }

    private static String getResult(HttpRequestBase request) {
        String result = null;
        CloseableHttpClient httpClient = getHttpClient();
        try {
            CloseableHttpResponse response = httpClient.execute(request);
            // response.getStatusLine().getStatusCode();
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                // long len = entity.getContentLength();// -1 表示长度未知
                result = EntityUtils.toString(entity);
                response.close();
                // httpClient.close();
                return result;
            }
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return result;
    }
}
