package com.sabinghost19.nati_kld_ml.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.cassandra.config.AbstractCassandraConfiguration;
import org.springframework.data.cassandra.config.CqlSessionFactoryBean;
import org.springframework.data.cassandra.config.SchemaAction;
import org.springframework.data.cassandra.core.cql.keyspace.CreateKeyspaceSpecification;
import org.springframework.data.cassandra.core.cql.keyspace.KeyspaceOption;
import org.springframework.data.cassandra.repository.config.EnableCassandraRepositories;

import java.util.Collections;
import java.util.List;

@Configuration
@EnableCassandraRepositories(basePackages = "com.sabinghost19.nati_kld_ml.repository")
public class CassandraConfig extends AbstractCassandraConfiguration {

    @Value("${spring.cassandra.contact-points:localhost}")
    private String contactPoints;

    @Value("${spring.cassandra.port:9042}")
    private int port;

    @Value("${spring.cassandra.keyspace:products_keyspace}")
    private String keyspace;

    @Value("${spring.cassandra.username:cassandra}")
    private String username;

    @Value("${spring.cassandra.password:cassandra}")
    private String password;

    @Value("${spring.cassandra.local-datacenter:datacenter1}")
    private String datacenter;

    @Override
    protected String getKeyspaceName() {
        return keyspace;
    }

    @Override
    protected String getContactPoints() {
        return contactPoints;
    }

    @Override
    protected int getPort() {
        return port;
    }

    @Override
    public SchemaAction getSchemaAction() {
        return SchemaAction.CREATE_IF_NOT_EXISTS;
    }

    @Override
    protected List<CreateKeyspaceSpecification> getKeyspaceCreations() {
        CreateKeyspaceSpecification specification = CreateKeyspaceSpecification
                .createKeyspace(keyspace)
                .ifNotExists()
                .with(KeyspaceOption.DURABLE_WRITES, true)
                //simple replication for testing and using one datacenter
                //for every node increment it
                .withSimpleReplication(1);
        return Collections.singletonList(specification);
    }

    @Bean
    @Override
    public CqlSessionFactoryBean cassandraSession() {
        CqlSessionFactoryBean bean = new CqlSessionFactoryBean();
        bean.setContactPoints(getContactPoints());
        bean.setPort(getPort());
        bean.setKeyspaceName(getKeyspaceName());
        bean.setLocalDatacenter(datacenter);
        bean.setUsername(username);
        bean.setPassword(password);
        return bean;
    }
}