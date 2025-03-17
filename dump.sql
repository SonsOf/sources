--
-- PostgreSQL database dump
--

-- Dumped from database version 13.8
-- Dumped by pg_dump version 15.3

-- Started on 2025-02-05 17:32:11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 24683)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3148 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 227 (class 1255 OID 24684)
-- Name: my_upper(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.my_upper() RETURNS character varying
    LANGUAGE plpgsql
    AS $_$
	BEGIN
    	RETURN translate(lower($1), 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя', 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ');
	END;
$_$;


ALTER FUNCTION public.my_upper() OWNER TO postgres;

--
-- TOC entry 228 (class 1255 OID 24685)
-- Name: my_upper(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.my_upper(text) RETURNS character varying
    LANGUAGE plpgsql
    AS $_$
	BEGIN
    	RETURN translate(lower($1), 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяabcdefghijklmnopqrstuvwxyz', 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯABCDEFGHIJKLMNOPQRSTUVWXYZ');
	END;
$_$;


ALTER FUNCTION public.my_upper(text) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 200 (class 1259 OID 24686)
-- Name: departaments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departaments (
    id_departament integer NOT NULL,
    departament_name character varying(200) NOT NULL
);


ALTER TABLE public.departaments OWNER TO postgres;

--
-- TOC entry 3150 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN departaments.id_departament; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.departaments.id_departament IS 'Идентификатор отдела';


--
-- TOC entry 3151 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN departaments.departament_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.departaments.departament_name IS 'Название отдела';


--
-- TOC entry 201 (class 1259 OID 24689)
-- Name: direction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.direction (
    id_direction integer NOT NULL,
    direction_name character varying(150)
);


ALTER TABLE public.direction OWNER TO postgres;

--
-- TOC entry 3152 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN direction.id_direction; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.direction.id_direction IS 'Идентификатор направления темы';


--
-- TOC entry 3153 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN direction.direction_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.direction.direction_name IS 'Наименование направления темы';


--
-- TOC entry 202 (class 1259 OID 24692)
-- Name: gender; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gender (
    gender integer NOT NULL,
    gender_name character varying(10) NOT NULL
);


ALTER TABLE public.gender OWNER TO postgres;

--
-- TOC entry 3154 (class 0 OID 0)
-- Dependencies: 202
-- Name: COLUMN gender.gender; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.gender.gender IS 'Идентификатор пола сотрудника';


--
-- TOC entry 3155 (class 0 OID 0)
-- Dependencies: 202
-- Name: COLUMN gender.gender_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.gender.gender_name IS 'Название пола';


--
-- TOC entry 203 (class 1259 OID 24695)
-- Name: gender_id_gender_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.gender ALTER COLUMN gender ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.gender_id_gender_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 204 (class 1259 OID 24697)
-- Name: id_dep_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_dep_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.id_dep_seq OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 24699)
-- Name: id_direction_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_direction_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.id_direction_seq OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 24933)
-- Name: id_report_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_report_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.id_report_seq OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24839)
-- Name: id_task_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_task_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.id_task_seq OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24841)
-- Name: id_task_user_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_task_user_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.id_task_user_seq OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 24701)
-- Name: id_topic_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_topic_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.id_topic_seq OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 24703)
-- Name: priority; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.priority (
    priority integer NOT NULL,
    priority_name character varying(150) NOT NULL
);


ALTER TABLE public.priority OWNER TO postgres;

--
-- TOC entry 3156 (class 0 OID 0)
-- Dependencies: 207
-- Name: TABLE priority; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.priority IS 'Приоритет задачи';


--
-- TOC entry 3157 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN priority.priority; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.priority.priority IS 'Идентификатор приоритета';


--
-- TOC entry 3158 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN priority.priority_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.priority.priority_name IS 'Наименование приоритета';


--
-- TOC entry 208 (class 1259 OID 24706)
-- Name: priority_priority_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.priority ALTER COLUMN priority ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.priority_priority_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 209 (class 1259 OID 24708)
-- Name: report; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report (
    report integer NOT NULL,
    date_report timestamp without time zone,
    comment character varying(2048),
    id_task_user integer NOT NULL,
    execution numeric(4,0)
);


ALTER TABLE public.report OWNER TO postgres;

--
-- TOC entry 3159 (class 0 OID 0)
-- Dependencies: 209
-- Name: TABLE report; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.report IS 'Отчетность';


--
-- TOC entry 3160 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN report.report; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.report.report IS 'Идентификатор отчета';


--
-- TOC entry 3161 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN report.date_report; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.report.date_report IS 'Конечная дата отчета';


--
-- TOC entry 3162 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN report.comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.report.comment IS 'Комментарий';


--
-- TOC entry 3163 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN report.id_task_user; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.report.id_task_user IS 'Идентификатор пользователя';


--
-- TOC entry 3164 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN report.execution; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.report.execution IS 'Процент выполнения задачи';


--
-- TOC entry 210 (class 1259 OID 24715)
-- Name: reporting_report_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.report ALTER COLUMN report ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reporting_report_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 211 (class 1259 OID 24717)
-- Name: roles_system; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles_system (
    role_system integer NOT NULL,
    name_role character varying NOT NULL
);


ALTER TABLE public.roles_system OWNER TO postgres;

--
-- TOC entry 3165 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE roles_system; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.roles_system IS 'Роли';


--
-- TOC entry 3166 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN roles_system.role_system; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.roles_system.role_system IS 'id роли системы';


--
-- TOC entry 3167 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN roles_system.name_role; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.roles_system.name_role IS 'Наименование роли';


--
-- TOC entry 212 (class 1259 OID 24723)
-- Name: roles_id_role_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.roles_system ALTER COLUMN role_system ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roles_id_role_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 213 (class 1259 OID 24725)
-- Name: roles_task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles_task (
    role_task integer NOT NULL,
    name_role character varying(100) NOT NULL
);


ALTER TABLE public.roles_task OWNER TO postgres;

--
-- TOC entry 3168 (class 0 OID 0)
-- Dependencies: 213
-- Name: TABLE roles_task; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.roles_task IS 'Роли проекта';


--
-- TOC entry 3169 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN roles_task.role_task; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.roles_task.role_task IS 'id роли участника задачи';


--
-- TOC entry 3170 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN roles_task.name_role; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.roles_task.name_role IS 'Наименование роли';


--
-- TOC entry 214 (class 1259 OID 24728)
-- Name: roles_project_role_project_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.roles_task ALTER COLUMN role_task ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roles_project_role_project_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 215 (class 1259 OID 24730)
-- Name: status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.status (
    status integer NOT NULL,
    status_name character varying(150) NOT NULL
);


ALTER TABLE public.status OWNER TO postgres;

--
-- TOC entry 3171 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.status IS 'Статус задачи и проекта';


--
-- TOC entry 3172 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN status.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.status.status IS 'Идентификатор статуса';


--
-- TOC entry 3173 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN status.status_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.status.status_name IS 'Наименование статуса';


--
-- TOC entry 216 (class 1259 OID 24733)
-- Name: status_status_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.status ALTER COLUMN status ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.status_status_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 217 (class 1259 OID 24735)
-- Name: task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task (
    id_task integer NOT NULL,
    task_name character varying(200) NOT NULL,
    task_information character varying(1000),
    task_lasting numeric(3,0) DEFAULT (1)::numeric NOT NULL,
    date_create timestamp without time zone NOT NULL,
    date_start timestamp without time zone,
    date_finish timestamp without time zone,
    priority integer DEFAULT 1 NOT NULL,
    status integer DEFAULT 1,
    id_type integer DEFAULT 1,
    id_direction integer,
    id_user integer NOT NULL,
    "order" numeric NOT NULL,
    id_topic integer
);


ALTER TABLE public.task OWNER TO postgres;

--
-- TOC entry 3174 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task.id_task; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task.id_task IS 'Идентификатор задачи';


--
-- TOC entry 3175 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task.task_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task.task_name IS 'Название задачи';


--
-- TOC entry 3176 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task.task_information; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task.task_information IS 'Описание задачи';


--
-- TOC entry 3177 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task.task_lasting; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task.task_lasting IS 'Длительность';


--
-- TOC entry 3178 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task.date_create; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task.date_create IS 'Дата создания задачи';


--
-- TOC entry 3179 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task.date_start; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task.date_start IS 'Дата начала задачи';


--
-- TOC entry 3180 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task.date_finish; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task.date_finish IS 'Дата окончания задачи';


--
-- TOC entry 3181 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task.priority; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task.priority IS 'Идентификатор приоритета';


--
-- TOC entry 3182 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task.status IS 'Статус задачи';


--
-- TOC entry 3183 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task.id_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task.id_type IS 'Идентификатор типа задачи';


--
-- TOC entry 3184 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task.id_direction; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task.id_direction IS 'Идентификатор тематики задачи';


--
-- TOC entry 3185 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task.id_user; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task.id_user IS 'Заводивший задачу';


--
-- TOC entry 3186 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task."order"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task."order" IS 'Порядок следования';


--
-- TOC entry 3187 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN task.id_topic; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task.id_topic IS 'Идентификатор темы';


--
-- TOC entry 218 (class 1259 OID 24746)
-- Name: task_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_user (
    id_task integer NOT NULL,
    id_user integer NOT NULL,
    role_task integer DEFAULT 1,
    id_task_user integer NOT NULL
);


ALTER TABLE public.task_user OWNER TO postgres;

--
-- TOC entry 3188 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN task_user.id_task; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task_user.id_task IS 'Идентификатор задачи';


--
-- TOC entry 3189 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN task_user.id_user; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task_user.id_user IS 'Идентификатор пользователя';


--
-- TOC entry 3190 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN task_user.role_task; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task_user.role_task IS 'Идентификатор роли задачи';


--
-- TOC entry 3191 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN task_user.id_task_user; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.task_user.id_task_user IS 'Идентификатор исполнителя задачи';


--
-- TOC entry 219 (class 1259 OID 24750)
-- Name: topic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.topic (
    id_topic integer NOT NULL,
    topic_name character varying(200) NOT NULL,
    topic_code character varying(50) NOT NULL,
    id_departament integer NOT NULL,
    id_direction integer
);


ALTER TABLE public.topic OWNER TO postgres;

--
-- TOC entry 3192 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN topic.id_topic; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.topic.id_topic IS 'Идентификатор темы';


--
-- TOC entry 3193 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN topic.topic_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.topic.topic_name IS 'Название темы';


--
-- TOC entry 3194 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN topic.topic_code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.topic.topic_code IS 'Код темы';


--
-- TOC entry 3195 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN topic.id_departament; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.topic.id_departament IS 'Наименование отдела';


--
-- TOC entry 3196 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN topic.id_direction; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.topic.id_direction IS 'Идентификатор направления темы';


--
-- TOC entry 220 (class 1259 OID 24753)
-- Name: topic_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.topic_user (
    id_topic integer NOT NULL,
    id_user integer NOT NULL
);


ALTER TABLE public.topic_user OWNER TO postgres;

--
-- TOC entry 3197 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN topic_user.id_topic; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.topic_user.id_topic IS 'Идентификатор темы';


--
-- TOC entry 3198 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN topic_user.id_user; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.topic_user.id_user IS 'Идентификатор пользователя';


--
-- TOC entry 221 (class 1259 OID 24756)
-- Name: type_task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_task (
    id_type integer NOT NULL,
    name_type character varying(200) NOT NULL
);


ALTER TABLE public.type_task OWNER TO postgres;

--
-- TOC entry 3199 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN type_task.id_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.type_task.id_type IS 'Идентификатор типа задачи';


--
-- TOC entry 3200 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN type_task.name_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.type_task.name_type IS 'Наименование типа задачи';


--
-- TOC entry 222 (class 1259 OID 24759)
-- Name: type_task_id_type_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.type_task ALTER COLUMN id_type ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.type_task_id_type_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 24761)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id_user integer NOT NULL,
    name character varying(100) DEFAULT NULL::character varying NOT NULL,
    first_name character varying(100),
    second_name character varying(100),
    email character varying(150),
    role_system integer DEFAULT NULL::numeric,
    login character varying(50),
    password character varying(300) DEFAULT NULL::character varying,
    date_birth timestamp without time zone,
    date_reg timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    background character varying(20) DEFAULT 'neptun'::character varying,
    gender integer,
    boss_id numeric(10,0),
    proflevel numeric(10,0),
    "position" character varying(200),
    creating numeric(1,0) DEFAULT 0
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3201 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.users IS 'Пользователи';


--
-- TOC entry 3202 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.id_user; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.id_user IS 'id пользователя';


--
-- TOC entry 3203 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.name IS 'Имя пользователя';


--
-- TOC entry 3204 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.first_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.first_name IS 'Фамилия';


--
-- TOC entry 3205 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.second_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.second_name IS 'Отчество';


--
-- TOC entry 3206 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.email IS 'EMAIL пользователя';


--
-- TOC entry 3207 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.role_system; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.role_system IS 'Роль пользователя';


--
-- TOC entry 3208 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.login; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.login IS 'Логин';


--
-- TOC entry 3209 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.password; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.password IS 'Пароль';


--
-- TOC entry 3210 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.date_birth; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.date_birth IS 'Дата рождения';


--
-- TOC entry 3211 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.date_reg; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.date_reg IS 'Дата регистрации';


--
-- TOC entry 3212 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.background; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.background IS 'Фон приложения';


--
-- TOC entry 3213 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.gender; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.gender IS 'Пол пользователя';


--
-- TOC entry 3214 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.boss_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.boss_id IS 'Идентификатор начальника пользователя';


--
-- TOC entry 3215 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.proflevel; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.proflevel IS 'Професиональный уровень';


--
-- TOC entry 3216 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users."position"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."position" IS 'Должность';


--
-- TOC entry 3217 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN users.creating; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.creating IS 'Создание задач';


--
-- TOC entry 3116 (class 0 OID 24686)
-- Dependencies: 200
-- Data for Name: departaments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departaments (id_departament, departament_name) FROM stdin;
\.


--
-- TOC entry 3117 (class 0 OID 24689)
-- Dependencies: 201
-- Data for Name: direction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.direction (id_direction, direction_name) FROM stdin;
\.


--
-- TOC entry 3118 (class 0 OID 24692)
-- Dependencies: 202
-- Data for Name: gender; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gender (gender, gender_name) FROM stdin;
1	М
2	Ж
\.


--
-- TOC entry 3123 (class 0 OID 24703)
-- Dependencies: 207
-- Data for Name: priority; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.priority (priority, priority_name) FROM stdin;
1	ОБЫЧНАЯ
2	ВАЖНАЯ
3	СВЕРХВАЖНАЯ
\.


--
-- TOC entry 3125 (class 0 OID 24708)
-- Dependencies: 209
-- Data for Name: report; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.report (report, date_report, comment, id_task_user, execution) FROM stdin;
\.


--
-- TOC entry 3127 (class 0 OID 24717)
-- Dependencies: 211
-- Data for Name: roles_system; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles_system (role_system, name_role) FROM stdin;
1	ADMIN
2	USER
\.


--
-- TOC entry 3129 (class 0 OID 24725)
-- Dependencies: 213
-- Data for Name: roles_task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles_task (role_task, name_role) FROM stdin;
1	ИСПОЛНИТЕЛЬ
2	ПРОВЕРЯЮРИЙ
3	КОНТРОЛЕР
\.


--
-- TOC entry 3131 (class 0 OID 24730)
-- Dependencies: 215
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.status (status, status_name) FROM stdin;
1	СОЗДАНА
2	В РАБОТЕ
\.


--
-- TOC entry 3133 (class 0 OID 24735)
-- Dependencies: 217
-- Data for Name: task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task (id_task, task_name, task_information, task_lasting, date_create, date_start, date_finish, priority, status, id_type, id_direction, id_user, "order", id_topic) FROM stdin;
\.


--
-- TOC entry 3134 (class 0 OID 24746)
-- Dependencies: 218
-- Data for Name: task_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_user (id_task, id_user, role_task, id_task_user) FROM stdin;
\.


--
-- TOC entry 3135 (class 0 OID 24750)
-- Dependencies: 219
-- Data for Name: topic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.topic (id_topic, topic_name, topic_code, id_departament, id_direction) FROM stdin;
\.


--
-- TOC entry 3136 (class 0 OID 24753)
-- Dependencies: 220
-- Data for Name: topic_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.topic_user (id_topic, id_user) FROM stdin;
\.


--
-- TOC entry 3137 (class 0 OID 24756)
-- Dependencies: 221
-- Data for Name: type_task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_task (id_type, name_type) FROM stdin;
1	ПЛАНОВАЯ
2	ВНЕПЛАНОВАЯ
\.


--
-- TOC entry 3139 (class 0 OID 24761)
-- Dependencies: 223
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id_user, name, first_name, second_name, email, role_system, login, password, date_birth, date_reg, background, gender, boss_id, proflevel, "position", creating) FROM stdin;
\.


--
-- TOC entry 3218 (class 0 OID 0)
-- Dependencies: 203
-- Name: gender_id_gender_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gender_id_gender_seq', 2, true);


--
-- TOC entry 3219 (class 0 OID 0)
-- Dependencies: 204
-- Name: id_dep_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.id_dep_seq', 42, true);


--
-- TOC entry 3220 (class 0 OID 0)
-- Dependencies: 205
-- Name: id_direction_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.id_direction_seq', 190, true);


--
-- TOC entry 3221 (class 0 OID 0)
-- Dependencies: 226
-- Name: id_report_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.id_report_seq', 5, true);


--
-- TOC entry 3222 (class 0 OID 0)
-- Dependencies: 224
-- Name: id_task_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.id_task_seq', 18, true);


--
-- TOC entry 3223 (class 0 OID 0)
-- Dependencies: 225
-- Name: id_task_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.id_task_user_seq', 13, true);


--
-- TOC entry 3224 (class 0 OID 0)
-- Dependencies: 206
-- Name: id_topic_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.id_topic_seq', 780, true);


--
-- TOC entry 3225 (class 0 OID 0)
-- Dependencies: 208
-- Name: priority_priority_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.priority_priority_seq', 3, true);


--
-- TOC entry 3226 (class 0 OID 0)
-- Dependencies: 210
-- Name: reporting_report_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reporting_report_seq', 10, true);


--
-- TOC entry 3227 (class 0 OID 0)
-- Dependencies: 212
-- Name: roles_id_role_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_role_seq', 2, true);


--
-- TOC entry 3228 (class 0 OID 0)
-- Dependencies: 214
-- Name: roles_project_role_project_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_project_role_project_seq', 3, true);


--
-- TOC entry 3229 (class 0 OID 0)
-- Dependencies: 216
-- Name: status_status_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.status_status_seq', 2, true);


--
-- TOC entry 3230 (class 0 OID 0)
-- Dependencies: 222
-- Name: type_task_id_type_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_task_id_type_seq', 2, true);


--
-- TOC entry 2944 (class 2606 OID 24774)
-- Name: departaments departaments_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departaments
    ADD CONSTRAINT departaments_unique UNIQUE (id_departament);


--
-- TOC entry 2946 (class 2606 OID 24776)
-- Name: direction direction_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direction
    ADD CONSTRAINT direction_unique UNIQUE (id_direction);


--
-- TOC entry 2948 (class 2606 OID 24778)
-- Name: gender gender_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gender
    ADD CONSTRAINT gender_unique UNIQUE (gender);


--
-- TOC entry 2950 (class 2606 OID 24780)
-- Name: priority priority_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.priority
    ADD CONSTRAINT priority_pk PRIMARY KEY (priority);


--
-- TOC entry 2952 (class 2606 OID 24782)
-- Name: report reporting_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT reporting_pk PRIMARY KEY (report);


--
-- TOC entry 2954 (class 2606 OID 24784)
-- Name: roles_system roles_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_system
    ADD CONSTRAINT roles_pk PRIMARY KEY (role_system);


--
-- TOC entry 2956 (class 2606 OID 24786)
-- Name: roles_task roles_task_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_task
    ADD CONSTRAINT roles_task_unique UNIQUE (role_task);


--
-- TOC entry 2958 (class 2606 OID 24788)
-- Name: status status_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pk PRIMARY KEY (status);


--
-- TOC entry 2960 (class 2606 OID 24790)
-- Name: task task_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_unique UNIQUE (id_task);


--
-- TOC entry 2962 (class 2606 OID 24838)
-- Name: task_user task_user_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_user
    ADD CONSTRAINT task_user_unique UNIQUE (id_task_user);


--
-- TOC entry 2964 (class 2606 OID 24794)
-- Name: topic topic_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topic
    ADD CONSTRAINT topic_unique UNIQUE (id_topic);


--
-- TOC entry 2966 (class 2606 OID 24796)
-- Name: topic_user topic_user_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topic_user
    ADD CONSTRAINT topic_user_unique UNIQUE (id_topic, id_user);


--
-- TOC entry 2968 (class 2606 OID 24798)
-- Name: type_task type_task_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_task
    ADD CONSTRAINT type_task_unique UNIQUE (id_type);


--
-- TOC entry 2970 (class 2606 OID 24800)
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id_user);


--
-- TOC entry 2971 (class 2606 OID 24935)
-- Name: report report_task_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_task_user_fk FOREIGN KEY (id_task_user) REFERENCES public.task_user(id_task_user);


--
-- TOC entry 2972 (class 2606 OID 24868)
-- Name: task task_priority_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_priority_fk FOREIGN KEY (priority) REFERENCES public.priority(priority);


--
-- TOC entry 2973 (class 2606 OID 24873)
-- Name: task task_status_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_status_fk FOREIGN KEY (status) REFERENCES public.status(status);


--
-- TOC entry 2974 (class 2606 OID 24888)
-- Name: task task_topic_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_topic_fk FOREIGN KEY (id_topic) REFERENCES public.topic(id_topic);


--
-- TOC entry 2975 (class 2606 OID 24893)
-- Name: task task_type_task_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_type_task_fk FOREIGN KEY (id_type) REFERENCES public.type_task(id_type);


--
-- TOC entry 2977 (class 2606 OID 24928)
-- Name: task_user task_user_roles_task_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_user
    ADD CONSTRAINT task_user_roles_task_fk FOREIGN KEY (role_task) REFERENCES public.roles_task(role_task);


--
-- TOC entry 2978 (class 2606 OID 24918)
-- Name: task_user task_user_task_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_user
    ADD CONSTRAINT task_user_task_fk FOREIGN KEY (id_task) REFERENCES public.task(id_task);


--
-- TOC entry 2979 (class 2606 OID 24923)
-- Name: task_user task_user_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_user
    ADD CONSTRAINT task_user_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id_user);


--
-- TOC entry 2976 (class 2606 OID 24843)
-- Name: task task_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id_user);


--
-- TOC entry 2980 (class 2606 OID 24806)
-- Name: topic topic_departaments_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topic
    ADD CONSTRAINT topic_departaments_fk FOREIGN KEY (id_departament) REFERENCES public.departaments(id_departament);


--
-- TOC entry 2981 (class 2606 OID 24811)
-- Name: topic topic_direction_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topic
    ADD CONSTRAINT topic_direction_fk FOREIGN KEY (id_direction) REFERENCES public.direction(id_direction);


--
-- TOC entry 2982 (class 2606 OID 24816)
-- Name: topic_user topic_user_topic_fk3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topic_user
    ADD CONSTRAINT topic_user_topic_fk3 FOREIGN KEY (id_topic) REFERENCES public.topic(id_topic);


--
-- TOC entry 2983 (class 2606 OID 24821)
-- Name: topic_user topic_user_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topic_user
    ADD CONSTRAINT topic_user_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id_user);


--
-- TOC entry 2984 (class 2606 OID 24826)
-- Name: users users_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_fk FOREIGN KEY (role_system) REFERENCES public.roles_system(role_system);


--
-- TOC entry 2985 (class 2606 OID 24831)
-- Name: users users_gender_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_gender_fk FOREIGN KEY (gender) REFERENCES public.gender(gender);


--
-- TOC entry 3149 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2025-02-05 17:32:11

--
-- PostgreSQL database dump complete
--

