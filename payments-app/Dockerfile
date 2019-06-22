FROM python:3.5

WORKDIR /app
COPY . .

RUN pip install pipenv && \
    pipenv install --system --deploy --ignore-pipfile
CMD ["python", "./src/app.py"]
EXPOSE 5000
