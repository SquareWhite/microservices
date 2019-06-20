FROM postgres

ADD 1postgres-ddl.sql /docker-entrypoint-initdb.d
ADD 2postgres-init.sql /docker-entrypoint-initdb.d

EXPOSE 5432

